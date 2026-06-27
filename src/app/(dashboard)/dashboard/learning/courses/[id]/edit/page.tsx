import { getRequiredUserId } from "@/lib/auth-helpers";
import { db } from "@/db";
import { courses } from "@/db/schema/courses";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditCourseForm } from "./edit-course-form";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getRequiredUserId();

  const course = await db
    .select()
    .from(courses)
    .where(and(eq(courses.id, id), eq(courses.userId, userId)))
    .then((rows) => rows[0]);

  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">编辑课程</h2>
        <p className="mt-1 text-sm text-gray-500">修改课程信息</p>
      </div>
      <div className="rounded-xl border bg-white p-6">
        <EditCourseForm
          course={{
            id: course.id,
            name: course.name,
            teacher: course.teacher ?? "",
            credits: course.credits ? Number(course.credits) : null,
            score: course.score ? Number(course.score) : null,
            semester: course.semester ?? "",
            category: course.category ?? "",
          }}
        />
      </div>
    </div>
  );
}
