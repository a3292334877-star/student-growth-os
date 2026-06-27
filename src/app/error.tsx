"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-200">出错了</h1>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          服务器遇到了问题
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          请稍后重试，如果问题持续存在请联系管理员
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            重试
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            返回首页
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-8 max-w-2xl overflow-auto rounded-lg bg-red-50 p-4 text-left text-xs text-red-600">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  );
}
