import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { studyLogs } from "@/db/schema/study-logs";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { date, durationMin, content, tags } = body;

    await db
      .update(studyLogs)
      .set({
        date,
        durationMin: durationMin ?? null,
        content: content ?? null,
        tags: tags ?? null,
      })
      .where(and(eq(studyLogs.id, id), eq(studyLogs.userId, session.user.id)));

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    console.error("Update study log error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db
      .delete(studyLogs)
      .where(and(eq(studyLogs.id, id), eq(studyLogs.userId, session.user.id)));

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("Delete study log error:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
