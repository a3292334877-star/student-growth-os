import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema/projects";
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
    const {
      name, role, description, highlights, reflection,
      githubUrl, startDate, endDate, status,
    } = body;

    await db
      .update(projects)
      .set({
        name,
        role: role || null,
        description: description || null,
        highlights: highlights || null,
        reflection: reflection || null,
        githubUrl: githubUrl || null,
        startDate: startDate || null,
        endDate: endDate || null,
        status: status || "ongoing",
      })
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)));

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    console.error("Update project error:", error);
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
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)));

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
