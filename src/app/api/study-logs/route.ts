import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { studyLogs } from "@/db/schema/study-logs";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, durationMin, content, tags } = body;

    await db.insert(studyLogs).values({
      userId: session.user.id,
      date,
      durationMin: durationMin ?? null,
      content: content ?? null,
      tags: tags ?? null,
    });

    return NextResponse.json({ message: "保存成功" }, { status: 201 });
  } catch (error) {
    console.error("Create study log error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const logList = await db
    .select()
    .from(studyLogs)
    .where(eq(studyLogs.userId, session.user.id))
    .orderBy(studyLogs.date);

  return NextResponse.json(logList);
}
