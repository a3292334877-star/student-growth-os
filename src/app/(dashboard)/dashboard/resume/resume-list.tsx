"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Resume } from "@/db/schema/resumes";
import type { ResumeEntry } from "@/db/schema/resume-entries";
import type { Project } from "@/db/schema/projects";
import type { Competition } from "@/db/schema/competitions";
import type { Course } from "@/db/schema/courses";
import type { Certificate } from "@/db/schema/certificates";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, FileText, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { ResumeBuilder } from "./resume-builder";

interface ResumeListProps {
  resumes: Resume[];
  resumeEntriesMap: Map<string, ResumeEntry[]>;
  availableProjects: Project[];
  availableCompetitions: Competition[];
  availableCourses: Course[];
  availableCertificates: Certificate[];
}

export function ResumeList({
  resumes,
  resumeEntriesMap,
  availableProjects,
  availableCompetitions,
  availableCourses,
  availableCertificates,
}: ResumeListProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);

  const handleCreate = useCallback(async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `我的简历 - ${new Date().toLocaleDateString("zh-CN")}` }),
      });

      if (!res.ok) throw new Error("创建失败");
      router.refresh();
    } catch {
      alert("创建失败");
    } finally {
      setCreating(false);
    }
  }, [router]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("确定删除这份简历？")) return;
      try {
        await fetch(`/api/resumes/${id}`, { method: "DELETE" });
        router.refresh();
      } catch {
        alert("删除失败");
      }
    },
    [router],
  );

  // If editing a specific resume
  if (editingResumeId) {
    const resume = resumes.find((r) => r.id === editingResumeId);
    const entries = resumeEntriesMap.get(editingResumeId) ?? [];

    if (!resume) {
      return <div>简历不存在</div>;
    }

    return (
      <ResumeBuilder
        resume={resume}
        initialEntries={entries}
        availableProjects={availableProjects}
        availableCompetitions={availableCompetitions}
        availableCourses={availableCourses}
        availableCertificates={availableCertificates}
        onBack={() => setEditingResumeId(null)}
      />
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="space-y-4">
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          创建新简历
        </button>
        <EmptyState
          title="还没有简历"
          description="点击上方按钮创建简历，从你的项目/经历中选择条目"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleCreate}
        disabled={creating}
        className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
      >
        {creating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        创建新简历
      </button>

      <div className="grid gap-4 md:grid-cols-2">
        {resumes.map((resume) => {
          const entries = resumeEntriesMap.get(resume.id) ?? [];
          const entryCount = entries.length;
          const sections = new Set(entries.map((e) => e.section));

          return (
            <div
              key={resume.id}
              className="rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary-50 p-2">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {resume.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {entryCount} 个条目 · {sections.size} 个板块
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setEditingResumeId(resume.id)}
                  className="flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  删除
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
