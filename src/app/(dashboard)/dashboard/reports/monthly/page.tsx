import { auth } from "@/lib/auth";
import { db } from "@/db";
import { monthlyReports } from "@/db/schema/monthly-reports";
import { eq, desc } from "drizzle-orm";
import { EmptyState } from "@/components/shared/empty-state";
import { MonthlyReportClient } from "./monthly-report-client";

export default async function MonthlyReportsPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const reports = await db
    .select()
    .from(monthlyReports)
    .where(eq(monthlyReports.userId, userId))
    .orderBy(desc(monthlyReports.year), desc(monthlyReports.month))
    .limit(12);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">月报</h2>
        <p className="mt-1 text-sm text-gray-500">
          AI 基于月度学习数据生成深度分析报告
        </p>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          title="还没有月报"
          description="至少需要一周的数据才能生成月报，继续记录吧"
          action={<MonthlyReportClient initialReports={[]} />}
        />
      ) : (
        <MonthlyReportClient initialReports={reports} />
      )}
    </div>
  );
}
