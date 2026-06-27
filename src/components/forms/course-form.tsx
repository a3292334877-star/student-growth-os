"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SEMESTERS } from "@/types";

interface CourseFormProps {
  initialData?: {
    id?: string;
    name: string;
    teacher: string;
    credits: number | null;
    score: number | null;
    semester: string;
    category: string;
  };
  onClose?: () => void;
}

export function CourseForm({ initialData, onClose }: CourseFormProps) {
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
      teacher: formData.get("teacher") as string,
      credits: formData.get("credits") ? Number(formData.get("credits")) : null,
      score: formData.get("score") ? Number(formData.get("score")) : null,
      semester: formData.get("semester") as string,
      category: formData.get("category") as string,
    };

    try {
      const url = initialData?.id
        ? `/api/courses/${initialData.id}`
        : "/api/courses";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "操作失败");
      }

      router.refresh();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          课程名称 <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={initialData?.name ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="如：数据结构与算法"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">教师</label>
        <input
          name="teacher"
          type="text"
          defaultValue={initialData?.teacher ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="任课教师"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">学分</label>
          <input
            name="credits"
            type="number"
            step="0.5"
            defaultValue={initialData?.credits ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="如：3.0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">成绩</label>
          <input
            name="score"
            type="number"
            step="0.1"
            defaultValue={initialData?.score ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="如：92.5"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">学期</label>
        <select
          name="semester"
          defaultValue={initialData?.semester ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">选择学期</option>
          {SEMESTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">课程类别</label>
        <select
          name="category"
          defaultValue={initialData?.category ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">选择类别</option>
          <option value="general">通识课</option>
          <option value="major">专业课</option>
          <option value="elective">选修课</option>
          <option value="english">英语课</option>
          <option value="pe">体育课</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "保存中..." : initialData?.id ? "更新" : "添加"}
        </button>
      </div>
    </form>
  );
}
