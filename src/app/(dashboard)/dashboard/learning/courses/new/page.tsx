import { CourseFormWrapper } from "./course-form-wrapper";

export default function NewCoursePage() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">添加课程</h2>
        <p className="mt-1 text-sm text-gray-500">填写课程信息</p>
      </div>
      <div className="rounded-xl border bg-white p-6">
        <CourseFormWrapper />
      </div>
    </div>
  );
}
