"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewStudyLogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      date: formData.get("date") as string,
      durationMin: formData.get("durationMin")
        ? Number(formData.get("durationMin"))
        : null,
      content: formData.get("content") as string,
      tags: (formData.get("tags") as string)
        .split(/[,，、]/)
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/study-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("保存失败");

      router.push("/dashboard/learning/logs");
      router.refresh();
    } catch {
      setError("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">写学习日志</h2>
        <p className="mt-1 text-sm text-gray-500">
          记录今天的学习内容和收获
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border bg-white p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                日期 <span className="text-red-500">*</span>
              </label>
              <input
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                学习时长（分钟）
              </label>
              <input
                name="durationMin"
                type="number"
                min={0}
                max={1440}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                placeholder="如：120"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              学习内容
            </label>
            <textarea
              name="content"
              rows={10}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-mono focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="支持 Markdown 格式&#10;&#10;## 今日学习&#10;- 学习了什么内容&#10;- 关键知识点&#10;- 遇到的问题和解决方案"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              标签（用逗号分隔）
            </label>
            <input
              name="tags"
              type="text"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              placeholder="如：数据结构, 算法, Python"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
