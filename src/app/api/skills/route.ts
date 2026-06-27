import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { skillTags } from "@/db/schema/skill-tags";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const skills = await db
    .select()
    .from(skillTags)
    .where(eq(skillTags.userId, session.user.id))
    .orderBy(skillTags.proficiency);

  return NextResponse.json(skills);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, category, proficiency, source } = body;

    // Check if exists
    const existing = await db
      .select()
      .from(skillTags)
      .where(
        and(
          eq(skillTags.userId, session.user.id),
          eq(skillTags.name, name),
        ),
      )
      .then((rows) => rows[0]);

    if (existing) {
      // Update proficiency
      await db
        .update(skillTags)
        .set({ proficiency: proficiency ?? existing.proficiency })
        .where(eq(skillTags.id, existing.id));
      return NextResponse.json(existing);
    }

    const [skill] = await db
      .insert(skillTags)
      .values({
        userId: session.user.id,
        name,
        category: category || null,
        proficiency: proficiency || 1,
        source: source || "manual",
      })
      .returning();

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Create skill error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, category, proficiency } = body;

    await db
      .update(skillTags)
      .set({
        name: name ?? undefined,
        category: category ?? undefined,
        proficiency: proficiency ?? undefined,
      })
      .where(and(eq(skillTags.id, id), eq(skillTags.userId, session.user.id)));

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    console.error("Update skill error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 });
  }

  try {
    await db
      .delete(skillTags)
      .where(and(eq(skillTags.id, id), eq(skillTags.userId, session.user.id)));

    return NextResponse.json({ message: "删除成功" });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
