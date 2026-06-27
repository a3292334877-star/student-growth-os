import { auth } from "@/lib/auth";
import { db } from "@/db";
import { courses } from "@/db/schema/courses";
import { studyLogs } from "@/db/schema/study-logs";
import { projects } from "@/db/schema/projects";
import { competitions } from "@/db/schema/competitions";
import { certificates } from "@/db/schema/certificates";
import { weeklyReports } from "@/db/schema/weekly-reports";
import { eq, desc } from "drizzle-orm";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Timeline } from "@/components/dashboard/timeline";
import { LearningHeatmap } from "@/components/dashboard/heatmap";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [
    courseList,
    logList,
    projectList,
    competitionList,
    certificateList,
    latestWeeklyReport,
  ] = await Promise.all([
    db.select().from(courses).where(eq(courses.userId, userId)),
    db.select().from(studyLogs).where(eq(studyLogs.userId, userId)),
    db.select().from(projects).where(eq(projects.userId, userId)),
    db.select().from(competitions).where(eq(competitions.userId, userId)),
    db.select().from(certificates).where(eq(certificates.userId, userId)),
    db
      .select()
      .from(weeklyReports)
      .where(eq(weeklyReports.userId, userId))
      .orderBy(desc(weeklyReports.year), desc(weeklyReports.weekNumber))
      .limit(1)
      .then((rows) => rows[0] ?? null),
  ]);

  const totalStudyMinutes = logList.reduce(
    (sum, log) => sum + (log.durationMin ?? 0),
    0,
  );
  const totalCompletedProjects = projectList.filter(
    (p) => p.status === "completed",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            欢迎回来，{session?.user?.name || "同学"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            这是你的成长概览 · 共 {logList.length} 条学习记录
          </p>
        </div>

        <Link
          href="/dashboard/reports/weekly"
          className="hidden items-center gap-2 rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 md:flex"
        >
          <Sparkles className="h-4 w-4" />
          {latestWeeklyReport
            ? `查看第${latestWeeklyReport.weekNumber}周周报`
            : "生成周报"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <StatsCards
        courseCount={courseList.length}
        totalStudyHours={Math.round(totalStudyMinutes / 60)}
        projectCount={projectList.length}
        completedProjects={totalCompletedProjects}
        competitionCount={competitionList.length}
        certificateCount={certificateList.length}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <LearningHeatmap logs={logList} />
        <Timeline
          courses={courseList}
          projects={projectList}
          competitions={competitionList}
          certificates={certificateList}
        />
      </div>

      {/* Mobile quick actions */}
      <div className="flex gap-3 md:hidden">
        <Link
          href="/dashboard/reports/weekly"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white"
        >
          <Sparkles className="h-4 w-4" />
          {latestWeeklyReport ? "查看周报" : "生成周报"}
        </Link>
        <Link
          href="/dashboard/learning/logs/new"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700"
        >
          写学习日志
        </Link>
      </div>
    </div>
  );
}
