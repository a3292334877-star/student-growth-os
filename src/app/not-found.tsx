import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">页面不存在</h2>
        <p className="mt-2 text-sm text-gray-500">
          你访问的页面不存在或已被移除
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            返回首页
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            前往仪表盘
          </Link>
        </div>
      </div>
    </div>
  );
}
