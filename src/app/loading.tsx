import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-600" />
        <p className="mt-2 text-sm text-gray-500">加载中...</p>
      </div>
    </div>
  );
}
