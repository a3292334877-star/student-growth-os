"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Note } from "@/db/schema/notes";
import { formatDate } from "@/lib/utils";
import { Trash2, Search, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

interface NoteListClientProps {
  notes: Note[];
  categories: string[];
}

export function NoteListClient({ notes, categories }: NoteListClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return notes.filter((note) => {
      if (search) {
        const q = search.toLowerCase();
        const matchTitle = note.title.toLowerCase().includes(q);
        const matchContent = note.content?.toLowerCase().includes(q);
        const matchTags = note.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchTags) return false;
      }
      if (selectedCategory && note.category !== selectedCategory) return false;
      return true;
    });
  }, [notes, search, selectedCategory]);

  async function handleDelete(id: string) {
    if (!confirm("确定删除这篇笔记？")) return;
    setDeleting(id);
    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      alert("删除失败");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索笔记..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
          >
            <option value="">全部分类</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((note) => (
          <div
            key={note.id}
            className="group rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <Link
                href={`/dashboard/notes/${note.id}/edit`}
                className="flex-1"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                      {note.title}
                    </h3>
                    {note.category && (
                      <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {note.category}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleDelete(note.id)}
                disabled={deleting === note.id}
                className="rounded p-1 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* AI Summary */}
            {note.aiSummary && (
              <div className="mt-3 flex items-start gap-1 rounded-md bg-purple-50 p-2">
                <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-purple-500" />
                <p className="text-xs text-purple-700">{note.aiSummary}</p>
              </div>
            )}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-3 text-xs text-gray-400">
              {formatDate(note.updatedAt || note.createdAt)}
            </p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && search && (
        <div className="py-12 text-center text-sm text-gray-500">
          没有找到匹配的笔记
        </div>
      )}
    </div>
  );
}
