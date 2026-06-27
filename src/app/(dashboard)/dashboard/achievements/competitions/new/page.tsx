"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COMPETITION_LEVELS } from "@/types";

export default function NewCompetitionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      level: formData.get("level") as string,
      award: formData.get("award") as string,
      role: formData.get("role") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      certificateUrl: formData.get("certificateUrl") as string,
    };

    try {
      const res = await fetch("/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("保存失败");

      router.push("/dashboard/achievements/competitions");
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
        <h2 className="text-2xl font-bold text-gray-900">添加比赛记录</h2>
        <p className="mt-1 text-sm text-gray-500">记录你的比赛经历</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border bg-white p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                比赛名称 <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                placeholder="如：全国大学生数学建模竞赛"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  比赛级别
                </label>
                <select
                  name="level"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                >
                  <option value="">选择级别</option>
                  {COMPETITION_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  获奖情况
                </label>
                <input
                  name="award"
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  placeholder="如：国家一等奖 / 银奖"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  角色
                </label>
                <input
                  name="role"
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  placeholder="如：队长 / 队员"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  比赛日期
                </label>
                <input
                  name="date"
                  type="date"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                比赛描述
              </label>
              <textarea
                name="description"
                rows={4}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                placeholder="比赛的背景、你的任务、取得的成果"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                证书链接（图片URL）
              </label>
              <input
                name="certificateUrl"
                type="url"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                placeholder="https://..."
              />
            </div>
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
            {loading ? "保存中..." : "添加"}
          </button>
        </div>
      </form>
    </div>
  );
}
