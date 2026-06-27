"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/db/schema/users";

interface SettingsFormProps {
  user: User;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      school: formData.get("school") as string,
      major: formData.get("major") as string,
      grade: formData.get("grade") as string,
    };

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("保存失败");

      setMessage("保存成功");
      router.refresh();
    } catch {
      setMessage("保存失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">姓名</label>
          <input
            name="name"
            type="text"
            defaultValue={user.name ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">邮箱</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">学校</label>
        <input
          name="school"
          type="text"
          defaultValue={user.school ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          placeholder="如：XX大学"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">专业</label>
          <input
            name="major"
            type="text"
            defaultValue={user.major ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
            placeholder="如：计算机科学与技术"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">年级</label>
          <select
            name="grade"
            defaultValue={user.grade ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          >
            <option value="">选择年级</option>
            <option value="2024级">2024级</option>
            <option value="2023级">2023级</option>
            <option value="2022级">2022级</option>
            <option value="2021级">2021级</option>
          </select>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message === "保存成功"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
