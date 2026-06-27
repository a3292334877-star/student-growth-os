import { auth } from "@/lib/auth";
import { EmptyState } from "@/components/shared/empty-state";

export default async function WeeklyReportsPage() {
  await auth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">周报</h2>
        <p className="mt-1 text-sm text-gray-500">
          AI 基于你的学习数据自动生成周报
        </p>
      </div>

      <EmptyState
        title="周报功能即将上线"
        description="此功能将在 M2 迭代中完成，AI将根据你的学习日志和项目进展自动生成周报"
      />
    </div>
  );
}
