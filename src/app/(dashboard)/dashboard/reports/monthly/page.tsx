import { auth } from "@/lib/auth";
import { EmptyState } from "@/components/shared/empty-state";

export default async function MonthlyReportsPage() {
  await auth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">月报</h2>
        <p className="mt-1 text-sm text-gray-500">
          AI 基于月度学习数据自动生成月报
        </p>
      </div>

      <EmptyState
        title="月报功能即将上线"
        description="此功能将在 M2 迭代中完成"
      />
    </div>
  );
}
