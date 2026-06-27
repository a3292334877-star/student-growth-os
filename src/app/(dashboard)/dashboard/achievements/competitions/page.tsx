import { getRequiredUserId } from "@/lib/auth-helpers";
import { db } from "@/db";
import { competitions } from "@/db/schema/competitions";
import { eq } from "drizzle-orm";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CompetitionList } from "./competition-list";

export default async function CompetitionsPage() {
  const userId = await getRequiredUserId();

  const competitionList = await db
    .select()
    .from(competitions)
    .where(eq(competitions.userId, userId))
    .orderBy(competitions.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">比赛经历</h2>
          <p className="mt-1 text-sm text-gray-500">
            记录你参加过的各类竞赛
          </p>
        </div>
        <Link
          href="/dashboard/achievements/competitions/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          添加比赛
        </Link>
      </div>

      {competitionList.length === 0 ? (
        <EmptyState
          title="还没有比赛记录"
          description="记录你的比赛经历，展示你的竞争力"
          action={
            <Link
              href="/dashboard/achievements/competitions/new"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              添加比赛
            </Link>
          }
        />
      ) : (
        <CompetitionList competitions={competitionList} />
      )}
    </div>
  );
}
