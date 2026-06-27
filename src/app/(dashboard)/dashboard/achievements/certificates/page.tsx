import { getRequiredUserId } from "@/lib/auth-helpers";
import { db } from "@/db";
import { certificates } from "@/db/schema/certificates";
import { eq } from "drizzle-orm";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CertificateList } from "./certificate-list";

export default async function CertificatesPage() {
  const userId = await getRequiredUserId();

  const certList = await db
    .select()
    .from(certificates)
    .where(eq(certificates.userId, userId))
    .orderBy(certificates.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">证书管理</h2>
          <p className="mt-1 text-sm text-gray-500">
            管理你的各类证书和认证
          </p>
        </div>
        <Link
          href="/dashboard/achievements/certificates/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          添加证书
        </Link>
      </div>

      {certList.length === 0 ? (
        <EmptyState
          title="还没有证书记录"
          description="添加你的证书，展示你的专业能力"
          action={
            <Link
              href="/dashboard/achievements/certificates/new"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              添加证书
            </Link>
          }
        />
      ) : (
        <CertificateList certificates={certList} />
      )}
    </div>
  );
}
