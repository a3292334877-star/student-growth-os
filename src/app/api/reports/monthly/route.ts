import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { monthlyReports } from "@/db/schema/monthly-reports";
import { eq, desc } from "drizzle-orm";
import { ReportGenerator } from "@/lib/services/report-generator";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const reports = await db
    .select()
    .from(monthlyReports)
    .where(eq(monthlyReports.userId, session.user.id))
    .orderBy(desc(monthlyReports.year), desc(monthlyReports.month));

  return NextResponse.json(reports);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const rateCheck = await checkRateLimit(session.user.id, "generate-monthly");
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "请求太频繁，请稍后再试" },
      { status: 429 },
    );
  }

  const body = await request.json();
  const year = body.year ?? ReportGenerator.getCurrentYearAndMonth().year;
  const month = body.month ?? ReportGenerator.getCurrentYearAndMonth().month;

  const generator = new ReportGenerator(session.user.id);
  const result = await generator.generateMonthlyReport(year, month);

  if (!result.success) {
    return NextResponse.json(
      { error: "生成失败，请检查 AI 配置后重试" },
      { status: 500 },
    );
  }

  return NextResponse.json({ content: result.content });
}
