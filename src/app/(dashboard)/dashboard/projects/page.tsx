import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema/projects";
import { eq } from "drizzle-orm";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectList } from "./project-list";

export default async function ProjectsPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const projectList = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(projects.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">项目经历</h2>
          <p className="mt-1 text-sm text-gray-500">
            记录你做过的项目，包括课程项目、个人项目和团队项目
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          添加项目
        </Link>
      </div>

      {projectList.length === 0 ? (
        <EmptyState
          title="还没有项目记录"
          description="添加你的第一个项目，展示你的实践能力"
          action={
            <Link
              href="/dashboard/projects/new"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              添加项目
            </Link>
          }
        />
      ) : (
        <ProjectList projects={projectList} />
      )}
    </div>
  );
}
