import { auth } from "@/lib/auth";
import { db } from "@/db";
import { courses } from "@/db/schema/courses";
import { studyLogs } from "@/db/schema/study-logs";
import { projects } from "@/db/schema/projects";
import { competitions } from "@/db/schema/competitions";
import { certificates } from "@/db/schema/certificates";
import { eq } from "drizzle-orm";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Timeline } from "@/components/dashboard/timeline";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [
    courseList,
    logList,
    projectList,
    competitionList,
    certificateList,
  ] = await Promise.all([
    db.select().from(courses).where(eq(courses.userId, userId)),
    db.select().from(studyLogs).where(eq(studyLogs.userId, userId)),
    db.select().from(projects).where(eq(projects.userId, userId)),
    db.select().from(competitions).where(eq(competitions.userId, userId)),
    db.select().from(certificates).where(eq(certificates.userId, userId)),
  ]);

  const totalStudyMinutes = logList.reduce((sum, log) => sum + (log.durationMin ?? 0), 0);
  const totalCompletedProjects = projectList.filter((p) => p.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          欢迎回来，{session?.user?.name || "同学"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          这是你的成长概览
        </p>
      </div>

      <StatsCards
        courseCount={courseList.length}
        totalStudyHours={Math.round(totalStudyMinutes / 60)}
        projectCount={projectList.length}
        completedProjects={totalCompletedProjects}
        competitionCount={competitionList.length}
        certificateCount={certificateList.length}
      />

      <Timeline
        courses={courseList}
        projects={projectList}
        competitions={competitionList}
        certificates={certificateList}
      />
    </div>
  );
}
