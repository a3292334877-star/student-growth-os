import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { resumes } from "@/db/schema/resumes";
import { resumeEntries } from "@/db/schema/resume-entries";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;

  const resume = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
    .then((rows) => rows[0]);

  if (!resume) {
    return NextResponse.json({ error: "简历不存在" }, { status: 404 });
  }

  const entries = await db
    .select()
    .from(resumeEntries)
    .where(eq(resumeEntries.resumeId, id))
    .orderBy(resumeEntries.sortOrder);

  return NextResponse.json({ ...resume, entries });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    await db
      .update(resumes)
      .set({
        title: body.title ?? undefined,
        templateId: body.templateId ?? undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));

    // Update entries if provided
    if (body.entries) {
      // Delete existing entries
      await db
        .delete(resumeEntries)
        .where(eq(resumeEntries.resumeId, id));

      // Insert new entries
      if (body.entries.length > 0) {
        await db.insert(resumeEntries).values(
          body.entries.map((entry: Record<string, unknown>, i: number) => ({
            resumeId: id,
            section: entry.section as string,
            sortOrder: i,
            sourceType: entry.sourceType as string,
            sourceId: entry.sourceId as string | null,
            title: entry.title as string,
            subtitle: entry.subtitle as string | null,
            description: entry.description as string | null,
            aiOptimized: entry.aiOptimized as string | null,
          })),
        );
      }
    }

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    console.error("Update resume error:", error);
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
      .delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));

    return NextResponse.json({ message: "删除成功" });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
