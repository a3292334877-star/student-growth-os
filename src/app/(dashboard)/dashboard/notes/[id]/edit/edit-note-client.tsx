"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Note } from "@/db/schema/notes";
import { Save, Sparkles, Loader2 } from "lucide-react";

interface EditNoteClientProps {
  note: Note;
}

export function EditNoteClient({ note }: EditNoteClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || "");
  const [category, setCategory] = useState(note.category || "");
  const [tagsStr, setTagsStr] = useState((note.tags || []).join(", "));
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          category: category || null,
          tags: tagsStr
            .split(/[,，、]/)
            .map((t) => t.trim())
            .filter(Boolean),
          generateSummary: true,
        }),
      });

      if (!res.ok) throw new Error("保存失败");
      router.push("/dashboard/notes");
      router.refresh();
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  }, [note.id, title, content, category, tagsStr, router]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">编辑笔记</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {showPreview ? "编辑" : "预览"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold"
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500">分类</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500">标签</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {showPreview ? (
          <div className="min-h-[400px] rounded-xl border bg-white p-6 prose prose-sm max-w-none">
            {renderMarkdown(content)}
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={25}
            className="w-full rounded-xl border border-gray-300 p-4 font-mono text-sm"
          />
        )}

        {note.aiSummary && (
          <div className="flex items-start gap-2 rounded-lg bg-purple-50 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs font-medium text-purple-700">AI 摘要</p>
              <p className="mt-1 text-sm text-purple-600">{note.aiSummary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function renderMarkdown(content: string): React.ReactNode {
  const html = content
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-lg font-bold mt-4 mb-2'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='text-xl font-bold mt-4 mb-2'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1 rounded text-red-600'>$1</code>")
    .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
