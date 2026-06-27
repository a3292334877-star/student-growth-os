import { auth } from "@/lib/auth";
import { db } from "@/db";
import { studyLogs } from "@/db/schema/study-logs";
import { eq } from "drizzle-orm";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StudyLogCalendar } from "./study-log-calendar";

export default async function StudyLogsPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const logList = await db
    .select()
    .from(studyLogs)
    .where(eq(studyLogs.userId, userId))
    .orderBy(studyLogs.date);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">学习日志</h2>
          <p className="mt-1 text-sm text-gray-500">
            记录每天的学习内容和时长
          </p>
        </div>
        <Link
          href="/dashboard/learning/logs/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          写日志
        </Link>
      </div>

      {logList.length === 0 ? (
        <EmptyState
          title="还没有学习日志"
          description="记录你的第一次学习，让成长有迹可循"
          action={
            <Link
              href="/dashboard/learning/logs/new"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              写日志
            </Link>
          }
        />
      ) : (
        <StudyLogCalendar logs={logList} />
      )}
    </div>
  );
}
