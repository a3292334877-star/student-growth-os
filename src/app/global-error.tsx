"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-200">严重错误</h1>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              应用发生了不可恢复的错误
            </h2>
            <button
              onClick={reset}
              className="mt-6 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
            >
              重试
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
