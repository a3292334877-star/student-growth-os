"use client";

import { useRouter } from "next/navigation";
import { CourseForm } from "@/components/forms/course-form";

interface EditCourseFormProps {
  course: {
    id: string;
    name: string;
    teacher: string;
    credits: number | null;
    score: number | null;
    semester: string;
    category: string;
  };
}

export function EditCourseForm({ course }: EditCourseFormProps) {
  const router = useRouter();

  return (
    <CourseForm
      initialData={{
        id: course.id,
        name: course.name,
        teacher: course.teacher,
        credits: course.credits,
        score: course.score,
        semester: course.semester,
        category: course.category,
      }}
      onClose={() => router.push("/dashboard/learning/courses")}
    />
  );
}
