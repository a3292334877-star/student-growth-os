import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { certificates } from "@/db/schema/certificates";
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
    const { name, issuer, certNumber, issueDate, expireDate, imageUrl } = body;

    await db
      .update(certificates)
      .set({
        name,
        issuer: issuer || null,
        certNumber: certNumber || null,
        issueDate: issueDate || null,
        expireDate: expireDate || null,
        imageUrl: imageUrl || null,
      })
      .where(
        and(eq(certificates.id, id), eq(certificates.userId, session.user.id)),
      );

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    console.error("Update certificate error:", error);
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
      .delete(certificates)
      .where(
        and(eq(certificates.id, id), eq(certificates.userId, session.user.id)),
      );

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("Delete certificate error:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
