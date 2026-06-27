import { auth } from "@/lib/auth";
import { db } from "@/db";
import { weeklyReports } from "@/db/schema/weekly-reports";
import { eq, desc } from "drizzle-orm";
import { EmptyState } from "@/components/shared/empty-state";
import { WeeklyReportClient } from "./weekly-report-client";

export default async function WeeklyReportsPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const reports = await db
    .select()
    .from(weeklyReports)
    .where(eq(weeklyReports.userId, userId))
    .orderBy(desc(weeklyReports.year), desc(weeklyReports.weekNumber))
    .limit(20);

  const hasReports = reports.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">周报</h2>
        <p className="mt-1 text-sm text-gray-500">
          AI 基于你的学习数据自动生成周报，可编辑和保存
        </p>
      </div>

      {!hasReports ? (
        <EmptyState
          title="还没有周报"
          description="点击下方按钮生成第一份周报，AI将根据你的数据自动生成"
          action={
            <WeeklyReportClient initialReports={[]} />
          }
        />
      ) : (
        <WeeklyReportClient initialReports={reports} />
      )}
    </div>
  );
}
