import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { courses } from "@/db/schema/courses";
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
    const { name, teacher, credits, score, semester, category } = body;

    await db
      .update(courses)
      .set({
        name,
        teacher: teacher || null,
        credits: credits?.toString() ?? null,
        score: score?.toString() ?? null,
        semester: semester || null,
        category: category || null,
      })
      .where(and(eq(courses.id, id), eq(courses.userId, session.user.id)));

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    console.error("Update course error:", error);
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
      .delete(courses)
      .where(and(eq(courses.id, id), eq(courses.userId, session.user.id)));

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
