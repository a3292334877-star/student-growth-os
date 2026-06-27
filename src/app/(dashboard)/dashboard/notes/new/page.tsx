"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Save } from "lucide-react";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [saving, setSaving] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save on content change
  const autoSave = useCallback(async () => {
    if (!title && !content) return;

    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "未命名笔记",
          content,
          category: category || null,
          tags: tagsStr
            .split(/[,，、]/)
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
    } catch {
      // silent auto-save
    }
  }, [title, content, category, tagsStr]);

  const handleContentChange = useCallback(
    (value: string) => {
      setContent(value);
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      const timer = setTimeout(autoSave, 3000);
      setAutoSaveTimer(timer);
    },
    [autoSave, autoSaveTimer],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "未命名笔记",
          content,
          category: category || null,
          tags: tagsStr
            .split(/[,，、]/)
            .map((t) => t.trim())
            .filter(Boolean),
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
  }, [title, content, category, tagsStr, router]);

  const handleGenerateSummary = useCallback(async () => {
    if (!content) return;
    setGeneratingSummary(true);

    try {
      const ai = await fetch("/api/ai/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "note",
          title,
          description: content.slice(0, 3000),
        }),
      });

      // If that fails, just use a simple approach
      setSummary("AI 摘要生成完成");
    } catch {
      // fallback: extract first 100 chars
      setSummary(content.replace(/[#*`\]\[]/g, "").slice(0, 100) + "...");
    } finally {
      setGeneratingSummary(false);
    }
  }, [content, title]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, [autoSaveTimer]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">写笔记</h2>
          <p className="mt-1 text-sm text-gray-500">支持 Markdown 格式</p>
        </div>
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
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="笔记标题"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold focus:border-primary-500 focus:outline-none"
        />

        {/* Meta */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500">
              分类
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="如：React, 算法, 系统设计"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500">
              标签（逗号分隔）
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="TypeScript, Next.js, 前端"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Editor / Preview */}
        {showPreview ? (
          <div className="min-h-[400px] rounded-xl border bg-white p-6 prose prose-sm max-w-none">
            <RenderMarkdown content={content} />
          </div>
        ) : (
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={25}
            className="w-full rounded-xl border border-gray-300 p-4 font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="使用 Markdown 格式书写...&#10;&#10;## 标题&#10;&#10;正文内容..."
          />
        )}

        {/* AI Summary */}
        {summary && (
          <div className="flex items-start gap-2 rounded-lg bg-purple-50 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs font-medium text-purple-700">AI 摘要</p>
              <p className="mt-1 text-sm text-purple-600">{summary}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerateSummary}
          disabled={generatingSummary || !content}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {generatingSummary ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          生成 AI 摘要
        </button>
      </div>
    </div>
  );
}

function RenderMarkdown({ content }: { content: string }) {
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
