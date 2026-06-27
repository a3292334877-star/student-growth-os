import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { SettingsForm } from "./settings-form";
import { ExportButton } from "@/components/dashboard/export-button";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .then((rows) => rows[0]);

  if (!user) {
    return <div>用户不存在</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">设置</h2>
        <p className="mt-1 text-sm text-gray-500">管理你的个人信息</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border bg-white p-6">
          <SettingsForm user={user} />
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">数据管理</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">导出所有数据</p>
              <p className="text-xs text-gray-500">
                导出 JSON 格式的完整数据备份
              </p>
            </div>
            <ExportButton />
          </div>
        </div>
      </div>
    </div>
  );
}
