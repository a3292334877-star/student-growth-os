import { auth } from "@/lib/auth";
import { db } from "@/db";
import { notes } from "@/db/schema/notes";
import { eq, desc } from "drizzle-orm";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { Plus } from "lucide-react";
import { NoteListClient } from "./note-list-client";

export default async function NotesPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const noteList = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.updatedAt));

  // Get unique categories
  const categories = [...new Set(noteList.map((n) => n.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">技术笔记</h2>
          <p className="mt-1 text-sm text-gray-500">
            记录学习笔记和知识总结
          </p>
        </div>
        <Link
          href="/dashboard/notes/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          写笔记
        </Link>
      </div>

      {noteList.length === 0 ? (
        <EmptyState
          title="还没有笔记"
          description="开始写第一篇技术笔记吧"
          action={
            <Link
              href="/dashboard/notes/new"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              写笔记
            </Link>
          }
        />
      ) : (
        <NoteListClient notes={noteList} categories={categories} />
      )}
    </div>
  );
}
