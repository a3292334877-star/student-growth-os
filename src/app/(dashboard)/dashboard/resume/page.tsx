import { auth } from "@/lib/auth";
import { EmptyState } from "@/components/shared/empty-state";

export default async function ResumePage() {
  await auth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">简历素材</h2>
        <p className="mt-1 text-sm text-gray-500">
          从你的数据中提取并生成简历素材
        </p>
      </div>

      <EmptyState
        title="简历功能即将上线"
        description="此功能将在 M3 迭代中完成，AI将基于你的项目和经历生成简历素材"
      />
    </div>
  );
}
