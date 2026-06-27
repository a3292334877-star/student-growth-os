import { auth } from "@/lib/auth";
import { db } from "@/db";
import { resumes } from "@/db/schema/resumes";
import { resumeEntries } from "@/db/schema/resume-entries";
import { projects } from "@/db/schema/projects";
import { competitions } from "@/db/schema/competitions";
import { courses } from "@/db/schema/courses";
import { certificates } from "@/db/schema/certificates";
import { eq, desc } from "drizzle-orm";
import { ResumeList } from "./resume-list";

export default async function ResumePage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [resumeList, projectList, competitionList, courseList, certList] =
    await Promise.all([
      db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, userId))
        .orderBy(desc(resumes.updatedAt)),
      db
        .select()
        .from(projects)
        .where(eq(projects.userId, userId)),
      db
        .select()
        .from(competitions)
        .where(eq(competitions.userId, userId)),
      db
        .select()
        .from(courses)
        .where(eq(courses.userId, userId)),
      db
        .select()
        .from(certificates)
        .where(eq(certificates.userId, userId)),
    ]);

  // Get entries for each resume
  const resumeEntriesMap = new Map<string, typeof resumeEntries.$inferSelect[]>();
  for (const resume of resumeList) {
    const entries = await db
      .select()
      .from(resumeEntries)
      .where(eq(resumeEntries.resumeId, resume.id))
      .orderBy(resumeEntries.sortOrder);
    resumeEntriesMap.set(resume.id, entries);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">简历素材</h2>
        <p className="mt-1 text-sm text-gray-500">
          从你的项目和经历中生成简历，AI 润色优化
        </p>
      </div>

      <ResumeList
        resumes={resumeList}
        resumeEntriesMap={resumeEntriesMap}
        availableProjects={projectList}
        availableCompetitions={competitionList}
        availableCourses={courseList}
        availableCertificates={certList}
      />
    </div>
  );
}
