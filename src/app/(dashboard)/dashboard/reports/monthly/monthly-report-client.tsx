"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { MonthlyReport } from "@/db/schema/monthly-reports";
import { Loader2, Sparkles, ChevronDown, ChevronUp, Check } from "lucide-react";

interface MonthlyReportClientProps {
  initialReports: MonthlyReport[];
}

const MONTH_LABELS = [
  "", "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

export function MonthlyReportClient({ initialReports }: MonthlyReportClientProps) {
  const router = useRouter();
  const [reports, setReports] = useState<MonthlyReport[]>(initialReports);
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
      const res = await fetch("/api/reports/monthly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成失败");
      }

      router.refresh();
      const refreshRes = await fetch("/api/reports/monthly");
      const newReports = await refreshRes.json();
      setReports(newReports);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试");
    } finally {
      setGenerating(false);
    }
  }, [router]);

  const handleSave = useCallback(
    async (id: string) => {
      setSaving(true);
      try {
        await fetch(`/api/reports/monthly/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            editedContent: editContent,
            status: "published",
          }),
        });

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

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              生成最新月报
            </>
          )}
        </button>
      </div>

      {reports.map((report) => {
        const label = `${report.year}年${MONTH_LABELS[report.month] || report.month + "月"}`;
        const isExpanded = expandedId === report.id;
        const isEditing = editingId === report.id;

        return (
          <div key={report.id} className="rounded-xl border bg-white shadow-sm">
            <button
              onClick={() => setExpandedId(isExpanded ? null : report.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{label}</h3>
                <p className="text-sm text-gray-500">
                  {report.status === "published" ? "已发布" : "草稿"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {report.status === "published" && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t px-6 py-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={25}
                      className="w-full rounded-lg border border-gray-300 p-4 font-mono text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleSave(report.id)}
                        disabled={saving}
                        className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                      >
                        {saving ? "保存中..." : "保存"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
                      {report.editedContent || report.aiContent || "暂无内容"}
                    </div>
                    <button
                      onClick={() => {
                        setEditingId(report.id);
                        setEditContent(
                          report.editedContent || report.aiContent || "",
                        );
                      }}
                      className="mt-4 text-sm text-primary-600 hover:text-primary-700"
                    >
                      编辑修改
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
