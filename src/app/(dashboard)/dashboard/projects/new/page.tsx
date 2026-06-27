"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
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
      role: formData.get("role") as string,
      description: formData.get("description") as string,
      highlights: formData.get("highlights") as string,
      reflection: formData.get("reflection") as string,
      githubUrl: formData.get("githubUrl") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: formData.get("status") as string,
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("保存失败");

      router.push("/dashboard/projects");
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
        <h2 className="text-2xl font-bold text-gray-900">添加项目</h2>
        <p className="mt-1 text-sm text-gray-500">
          记录你的项目经历，为简历积累素材
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border bg-white p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                项目名称 <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="如：校园二手交易平台"
              />
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
                  placeholder="如：项目负责人 / 后端开发"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  状态
                </label>
                <select
                  name="status"
                  defaultValue="ongoing"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                >
                  <option value="ongoing">进行中</option>
                  <option value="completed">已完成</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  开始日期
                </label>
                <input
                  name="startDate"
                  type="date"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  结束日期
                </label>
                <input
                  name="endDate"
                  type="date"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                GitHub 链接
              </label>
              <input
                name="githubUrl"
                type="url"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                项目描述
              </label>
              <textarea
                name="description"
                rows={4}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                placeholder="项目的功能、技术栈、你的贡献"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                项目亮点
              </label>
              <textarea
                name="highlights"
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                placeholder="这个项目中最值得展示的成果"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                项目反思
              </label>
              <textarea
                name="reflection"
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                placeholder="学到了什么？遇到了什么困难？如何解决的？"
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
            {loading ? "保存中..." : "添加项目"}
          </button>
        </div>
      </form>
    </div>
  );
}
