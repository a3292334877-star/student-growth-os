"use client";

import type { Course } from "@/db/schema/courses";
import { formatDate, calculateGPA } from "@/lib/utils";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const { gpa, totalCredits } = calculateGPA(
    courses.map((c) => ({
      credits: c.credits ? Number(c.credits) : null,
      score: c.score ? Number(c.score) : null,
    })),
  );

  async function handleDelete(id: string) {
    if (!confirm("确定删除这条记录？")) return;
    setDeleting(id);

    try {
      await fetch(`/api/courses/${id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      alert("删除失败");
    } finally {
      setDeleting(null);
    }
  }

  // Group by semester
  const grouped = courses.reduce(
    (acc, course) => {
      const semester = course.semester || "未分类";
      if (!acc[semester]) acc[semester] = [];
      acc[semester].push(course);
      return acc;
    },
    {} as Record<string, Course[]>,
  );

  return (
    <div className="space-y-6">
      {/* GPA Summary */}
      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-gray-500">当前GPA</p>
            <p className="text-2xl font-bold text-gray-900">{gpa.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">已修学分</p>
            <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">课程数</p>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
        </div>
      </div>

      {/* Course List */}
      {Object.entries(grouped).map(([semester, semesterCourses]) => (
        <div key={semester}>
          <h3 className="mb-3 text-sm font-semibold text-gray-600 uppercase">
            {semester === "未分类" ? "未分类" : semester}
          </h3>
          <div className="overflow-hidden rounded-xl border bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-4 py-3 font-medium">课程名称</th>
                  <th className="px-4 py-3 font-medium">教师</th>
                  <th className="px-4 py-3 font-medium">学分</th>
                  <th className="px-4 py-3 font-medium">成绩</th>
                  <th className="px-4 py-3 font-medium">类别</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {semesterCourses.map((course) => (
                  <tr key={course.id} className="border-b text-sm last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {course.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {course.teacher || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {course.credits ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          course.score && Number(course.score) >= 60
                            ? "text-green-600"
                            : course.score && Number(course.score) < 60
                              ? "text-red-600"
                              : "text-gray-400"
                        }
                      >
                        {course.score ?? "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {course.category || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/learning/courses/${course.id}/edit`}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(course.id)}
                          disabled={deleting === course.id}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
