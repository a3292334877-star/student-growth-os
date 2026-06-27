"use client";

import type { Project } from "@/db/schema/projects";
import { formatDate } from "@/lib/utils";
import { ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("确定删除这个项目？")) return;
    setDeleting(id);

    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      alert("删除失败");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="hover:text-primary-600"
                >
                  {project.name}
                </Link>
              </h3>
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                <span>{project.role || "未设置角色"}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    project.status === "completed"
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {project.status === "completed" ? "已完成" : "进行中"}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(project.id)}
              disabled={deleting === project.id}
              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 line-clamp-3 text-sm text-gray-600">
            {project.description || "暂无描述"}
          </p>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>
              {project.startDate
                ? `${formatDate(project.startDate)} - ${project.endDate ? formatDate(project.endDate) : "至今"}`
                : "时间未设置"}
            </span>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
              >
                <ExternalLink className="h-3 w-3" />
                GitHub
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
