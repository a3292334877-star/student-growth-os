import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { weeklyReports } from "@/db/schema/weekly-reports";
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
    const { editedContent, status } = body;

    await db
      .update(weeklyReports)
      .set({
        editedContent: editedContent ?? null,
        status: status ?? "draft",
        updatedAt: new Date(),
      })
      .where(
        and(eq(weeklyReports.id, id), eq(weeklyReports.userId, session.user.id)),
      );

    return NextResponse.json({ message: "更新成功" });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
