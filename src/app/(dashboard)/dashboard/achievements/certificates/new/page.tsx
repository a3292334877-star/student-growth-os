"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCertificatePage() {
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
      issuer: formData.get("issuer") as string,
      certNumber: formData.get("certNumber") as string,
      issueDate: formData.get("issueDate") as string,
      expireDate: formData.get("expireDate") as string,
      imageUrl: formData.get("imageUrl") as string,
    };

    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("保存失败");

      router.push("/dashboard/achievements/certificates");
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
        <h2 className="text-2xl font-bold text-gray-900">添加证书</h2>
        <p className="mt-1 text-sm text-gray-500">记录你的证书信息</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border bg-white p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                证书名称 <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                placeholder="如：CET-6 / 计算机二级"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  颁发机构
                </label>
                <input
                  name="issuer"
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  placeholder="如：教育部考试中心"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  证书编号
                </label>
                <input
                  name="certNumber"
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  placeholder="证书编号"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  颁发日期
                </label>
                <input
                  name="issueDate"
                  type="date"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  到期日期
                </label>
                <input
                  name="expireDate"
                  type="date"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                证书图片链接
              </label>
              <input
                name="imageUrl"
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
