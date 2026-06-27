import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { notes } from "@/db/schema/notes";
import { eq, desc, like, or, and } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  let query = db
    .select()
    .from(notes)
    .where(eq(notes.userId, session.user.id))
    .orderBy(desc(notes.updatedAt));

  const allNotes = await query;
  let filtered = allNotes;

  if (search) {
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content?.toLowerCase().includes(search.toLowerCase()) ||
        n.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
    );
  }

  if (category) {
    filtered = filtered.filter((n) => n.category === category);
  }

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, category, tags } = body;

    const [note] = await db
      .insert(notes)
      .values({
        userId: session.user.id,
        title: title || "未命名笔记",
        content: content || null,
        category: category || null,
        tags: tags || null,
      })
      .returning();

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
