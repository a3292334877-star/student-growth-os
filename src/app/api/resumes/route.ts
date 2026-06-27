import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { resumes } from "@/db/schema/resumes";
import { resumeEntries } from "@/db/schema/resume-entries";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const resumeList = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, session.user.id))
    .orderBy(desc(resumes.updatedAt));

  return NextResponse.json(resumeList);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title } = body;

    const [resume] = await db
      .insert(resumes)
      .values({
        userId: session.user.id,
        title: title || "我的简历",
      })
      .returning();

    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    console.error("Create resume error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
