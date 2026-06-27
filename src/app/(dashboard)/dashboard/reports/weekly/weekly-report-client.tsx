"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { WeeklyReport } from "@/db/schema/weekly-reports";
import { Loader2, Sparkles, ChevronDown, ChevronUp, Check, AlertCircle } from "lucide-react";

interface WeeklyReportClientProps {
  initialReports: WeeklyReport[];
}

export function WeeklyReportClient({ initialReports }: WeeklyReportClientProps) {
  const router = useRouter();
  const [reports, setReports] = useState<WeeklyReport[]>(initialReports);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setError("");

    try {
      console.log("[WeeklyReport] Generating report...");
      const res = await fetch("/api/reports/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      console.log("[WeeklyReport] Response status:", res.status);

      if (!res.ok) {
        let errMsg = "生成失败";
        try {
          const data = await res.json();
          errMsg = data.error || errMsg;
        } catch {
          errMsg = `服务器错误 (${res.status})`;
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      console.log("[WeeklyReport] Generated successfully");

      router.refresh();
      // Re-fetch reports
      const refreshRes = await fetch("/api/reports/weekly");
      const newReports = await refreshRes.json();
      setReports(newReports);
    } catch (err) {
      console.error("[WeeklyReport] Error:", err);
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试");
    } finally {
      setGenerating(false);
    }
  }, [router]);

  const handleSave = useCallback(
    async (id: string) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/reports/weekly/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            editedContent: editContent,
            status: "published",
          }),
        });

        if (!res.ok) throw new Error("保存失败");

        setEditingId(null);
        router.refresh();
      } catch {
        setError("保存失败");
      } finally {
        setSaving(false);
      }
    },
    [editContent, router],
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const startEdit = (report: WeeklyReport) => {
    setEditingId(report.id);
    setEditContent(report.editedContent || report.aiContent || "");
  };

  return (
    <div className="space-y-4">
      {/* Generate Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              生成本周周报
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Reports List */}
      {reports.length === 0 && !generating && (
        <div className="rounded-xl border bg-white p-12 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">
            点击上方按钮，AI 将基于你的学习数据生成周报
          </p>
        </div>
      )}

      {reports.map((report) => (
        <div
          key={report.id}
          className="rounded-xl border bg-white shadow-sm"
        >
          {/* Header */}
          <button
            onClick={() => toggleExpand(report.id)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
          >
            <div>
              <h3 className="font-semibold text-gray-900">
                {report.year}年 第{report.weekNumber}周
              </h3>
              <p className="text-sm text-gray-500">
                {report.status === "published" ? "已发布" : "草稿"}
                {report.editedContent && " · 已编辑"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {report.status === "published" && (
                <Check className="h-4 w-4 text-green-500" />
              )}
              {expandedId === report.id ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </button>

          {/* Content */}
          {expandedId === report.id && (
            <div className="border-t px-6 py-4">
              {editingId === report.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={20}
                    className="w-full rounded-lg border border-gray-300 p-4 font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleSave(report.id)}
                      disabled={saving}
                      className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 disabled:opacity-50"
                    >
                      {saving ? "保存中..." : "保存"}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <RenderMarkdown
                      content={report.editedContent || report.aiContent || ""}
                    />
                  </div>
                  {!report.editedContent && (
                    <button
                      onClick={() => startEdit(report)}
                      className="mt-4 text-sm text-primary-600 hover:text-primary-700"
                    >
                      编辑修改
                    </button>
                  )}
                  {report.editedContent && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => startEdit(report)}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        重新编辑
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(report.id);
                          setEditContent(report.aiContent || "");
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        查看AI原始版本
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RenderMarkdown({ content }: { content: string }) {
  // Simple markdown renderer without external dependency
  const html = content
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-lg font-bold mt-4 mb-2'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='text-xl font-bold mt-4 mb-2'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
