import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { competitions } from "@/db/schema/competitions";
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
    const { name, level, award, role, description, date, certificateUrl } = body;

    await db
      .update(competitions)
      .set({
        name,
        level: level || null,
        award: award || null,
        role: role || null,
        description: description || null,
        date: date || null,
        certificateUrl: certificateUrl || null,
      })
      .where(
        and(eq(competitions.id, id), eq(competitions.userId, session.user.id)),
      );

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    console.error("Update competition error:", error);
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
      .delete(competitions)
      .where(
        and(eq(competitions.id, id), eq(competitions.userId, session.user.id)),
      );

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("Delete competition error:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
