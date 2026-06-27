import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { courses } from "@/db/schema/courses";
import { studyLogs } from "@/db/schema/study-logs";
import { projects } from "@/db/schema/projects";
import { competitions } from "@/db/schema/competitions";
import { certificates } from "@/db/schema/certificates";
import { notes } from "@/db/schema/notes";
import { skillTags } from "@/db/schema/skill-tags";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const userId = session.user.id;

  const [courseList, logList, projectList, competitionList, certList, noteList, tagList] =
    await Promise.all([
      db.select().from(courses).where(eq(courses.userId, userId)),
      db.select().from(studyLogs).where(eq(studyLogs.userId, userId)),
      db.select().from(projects).where(eq(projects.userId, userId)),
      db.select().from(competitions).where(eq(competitions.userId, userId)),
      db.select().from(certificates).where(eq(certificates.userId, userId)),
      db.select().from(notes).where(eq(notes.userId, userId)),
      db.select().from(skillTags).where(eq(skillTags.userId, userId)),
    ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: {
      id: userId,
      email: session.user.email,
      name: session.user.name,
    },
    summary: {
      totalCourses: courseList.length,
      totalStudyLogs: logList.length,
      totalStudyMinutes: logList.reduce((sum, l) => sum + (l.durationMin ?? 0), 0),
      totalProjects: projectList.length,
      totalCompetitions: competitionList.length,
      totalCertificates: certList.length,
      totalNotes: noteList.length,
      totalSkills: tagList.length,
    },
    data: {
      courses: courseList,
      studyLogs: logList,
      projects: projectList,
      competitions: competitionList,
      certificates: certList,
      notes: noteList,
      skills: tagList,
    },
  };

  return NextResponse.json(exportData);
}
