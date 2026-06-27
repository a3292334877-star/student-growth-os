import { getRequiredUserId } from "@/lib/auth-helpers";
import { db } from "@/db";
import { courses } from "@/db/schema/courses";
import { eq } from "drizzle-orm";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CourseList } from "./course-list";

export default async function CoursesPage() {
  const userId = await getRequiredUserId();

  const courseList = await db
    .select()
    .from(courses)
    .where(eq(courses.userId, userId))
    .orderBy(courses.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">课程管理</h2>
          <p className="mt-1 text-sm text-gray-500">
            记录你的课程和成绩
          </p>
        </div>
        <Link
          href="/dashboard/learning/courses/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          添加课程
        </Link>
      </div>

      {courseList.length === 0 ? (
        <EmptyState
          title="还没有课程记录"
          description="添加你的第一门课程，开始管理你的学习数据"
          action={
            <Link
              href="/dashboard/learning/courses/new"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              添加课程
            </Link>
          }
        />
      ) : (
        <CourseList courses={courseList} />
      )}
    </div>
  );
}
