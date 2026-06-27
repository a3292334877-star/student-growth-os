import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { notes } from "@/db/schema/notes";
import { eq, and } from "drizzle-orm";
import { getAIProvider } from "@/lib/ai";

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
    const { title, content, category, tags, generateSummary } = body;

    const updateData: Record<string, unknown> = {
      title: title ?? undefined,
      content: content ?? undefined,
      category: category ?? undefined,
      tags: tags ?? undefined,
      updatedAt: new Date(),
    };

    // Auto-generate AI summary if requested
    if (generateSummary && content) {
      try {
        const ai = getAIProvider();
        const result = await ai.generate(
          "你是一名学习助手。请为以下笔记生成一段简洁的摘要（50-100字），提炼核心内容。",
          `笔记标题：${title}\n\n笔记内容：${content.slice(0, 3000)}`,
          { temperature: 0.3, maxTokens: 256 },
        );
        updateData.aiSummary = result.content.trim();
      } catch {
        // AI summary is optional, don't fail the request
      }
    }

    await db
      .update(notes)
      .set(updateData)
      .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)));

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    console.error("Update note error:", error);
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
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)));

    return NextResponse.json({ message: "删除成功" });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
