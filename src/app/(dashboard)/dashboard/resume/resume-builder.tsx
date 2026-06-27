"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Resume } from "@/db/schema/resumes";
import type { ResumeEntry } from "@/db/schema/resume-entries";
import type { Project } from "@/db/schema/projects";
import type { Competition } from "@/db/schema/competitions";
import type { Course } from "@/db/schema/courses";
import type { Certificate } from "@/db/schema/certificates";
import { ArrowLeft, Plus, Sparkles, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { ResumePreview } from "./resume-preview";

interface ResumeBuilderProps {
  resume: Resume;
  initialEntries: ResumeEntry[];
  availableProjects: Project[];
  availableCompetitions: Competition[];
  availableCourses: Course[];
  availableCertificates: Certificate[];
  onBack: () => void;
}

type Section = "education" | "project" | "skill" | "honor";

const SECTION_LABELS: Record<Section, string> = {
  education: "教育背景",
  project: "项目经历",
  skill: "技能",
  honor: "荣誉证书",
};

const SECTION_ORDER: Section[] = ["education", "project", "skill", "honor"];

export function ResumeBuilder({
  resume,
  initialEntries,
  availableProjects,
  availableCompetitions,
  availableCourses,
  availableCertificates,
  onBack,
}: ResumeBuilderProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<ResumeEntry[]>(initialEntries);
  const [title, setTitle] = useState(resume.title);
  const [saving, setSaving] = useState(false);
  const [polishing, setPolishing] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/resumes/${resume.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          entries: entries.map((e) => ({
            section: e.section,
            sourceType: e.sourceType,
            sourceId: e.sourceId,
            title: e.title,
            subtitle: e.subtitle,
            description: e.aiOptimized || e.description,
            aiOptimized: e.aiOptimized,
          })),
        }),
      });

      if (!res.ok) throw new Error("保存失败");
      router.refresh();
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  }, [resume.id, title, entries, router]);

  const handleAddFromProject = useCallback(
    (project: Project) => {
      const newEntry: ResumeEntry = {
        id: `temp-${Date.now()}`,
        resumeId: resume.id,
        section: "project",
        sortOrder: entries.length,
        sourceType: "project",
        sourceId: project.id,
        title: project.name,
        subtitle: project.role || "",
        description: project.description || "",
        aiOptimized: null,
        createdAt: new Date(),
      };
      setEntries((prev) => [...prev, newEntry]);
      setShowAddPanel(false);
    },
    [resume.id, entries.length],
  );

  const handleAddFromCompetition = useCallback(
    (comp: Competition) => {
      const newEntry: ResumeEntry = {
        id: `temp-${Date.now()}`,
        resumeId: resume.id,
        section: "honor",
        sortOrder: entries.length,
        sourceType: "competition",
        sourceId: comp.id,
        title: comp.name,
        subtitle: comp.award || comp.level || "",
        description: comp.description || "",
        aiOptimized: null,
        createdAt: new Date(),
      };
      setEntries((prev) => [...prev, newEntry]);
      setShowAddPanel(false);
    },
    [resume.id, entries.length],
  );

  const handleAddManual = useCallback(
    (section: Section) => {
      const newEntry: ResumeEntry = {
        id: `temp-${Date.now()}`,
        resumeId: resume.id,
        section,
        sortOrder: entries.length,
        sourceType: "manual",
        sourceId: null,
        title: "",
        subtitle: "",
        description: "",
        aiOptimized: null,
        createdAt: new Date(),
      };
      setEntries((prev) => [...prev, newEntry]);
    },
    [resume.id, entries.length],
  );

  const handleRemoveEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleEntryChange = useCallback(
    (id: string, field: string, value: string) => {
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
      );
    },
    [],
  );

  const handlePolish = useCallback(
    async (entry: ResumeEntry) => {
      setPolishing(entry.id);
      try {
        const res = await fetch("/api/ai/polish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: entry.sourceType,
            title: entry.title,
            subtitle: entry.subtitle,
            description: entry.aiOptimized || entry.description || "",
          }),
        });

        if (!res.ok) throw new Error("润色失败");

        const data = await res.json();
        handleEntryChange(entry.id, "aiOptimized", data.optimized);
      } catch {
        alert("AI 润色失败，请稍后重试");
      } finally {
        setPolishing(null);
      }
    },
    [handleEntryChange],
  );

  const groupedEntries = SECTION_ORDER.map((section) => ({
    section,
    label: SECTION_LABELS[section],
    entries: entries.filter((e) => e.section === section),
  }));

  if (showPreview) {
    return (
      <div>
        <button
          onClick={() => setShowPreview(false)}
          className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          返回编辑
        </button>
        <ResumePreview title={title} entries={entries} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          返回简历列表
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            预览
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">简历标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-lg font-semibold"
        />
      </div>

      {/* Entry Sections */}
      <div className="space-y-6">
        {groupedEntries.map(({ section, label, entries: sectionEntries }) => (
          <div key={section} className="rounded-xl border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{label}</h3>
              <button
                onClick={() => handleAddManual(section)}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-3 w-3" />
                手动添加
              </button>
            </div>

            {sectionEntries.length === 0 ? (
              <p className="text-sm text-gray-400">暂无条目</p>
            ) : (
              <div className="space-y-3">
                {sectionEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={entry.title ?? ""}
                          onChange={(e) =>
                            handleEntryChange(entry.id, "title", e.target.value)
                          }
                          className="w-full text-sm font-semibold text-gray-900 focus:outline-none focus:ring-0"
                          placeholder="标题"
                        />
                        <input
                          type="text"
                          value={entry.subtitle ?? ""}
                          onChange={(e) =>
                            handleEntryChange(
                              entry.id,
                              "subtitle",
                              e.target.value,
                            )
                          }
                          className="w-full text-xs text-gray-500 focus:outline-none focus:ring-0"
                          placeholder="副标题（角色/奖项/机构）"
                        />
                        <textarea
                          value={entry.aiOptimized || entry.description || ""}
                          onChange={(e) =>
                            handleEntryChange(
                              entry.id,
                              "description",
                              e.target.value,
                            )
                          }
                          rows={3}
                          className="w-full text-sm text-gray-700 focus:outline-none focus:ring-0"
                          placeholder="描述..."
                        />
                        {entry.aiOptimized && (
                          <div className="rounded-md bg-green-50 px-3 py-2">
                            <p className="text-xs font-medium text-green-700">
                              AI 优化版本
                            </p>
                            <p className="mt-1 text-xs text-green-600">
                              {entry.aiOptimized}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handlePolish(entry)}
                        disabled={polishing === entry.id}
                        className="flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 disabled:opacity-50"
                      >
                        {polishing === entry.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        AI 润色
                      </button>
                      <button
                        onClick={() => handleRemoveEntry(entry.id)}
                        className="flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3" />
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add from existing data */}
      <div className="rounded-xl border bg-white p-5">
        <button
          onClick={() => setShowAddPanel(!showAddPanel)}
          className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          <Plus className="h-4 w-4" />
          从已有数据添加
        </button>

        {showAddPanel && (
          <div className="mt-4 space-y-4">
            {availableProjects.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                  项目经历
                </h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {availableProjects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleAddFromProject(p)}
                      className="rounded-lg border border-gray-200 p-3 text-left text-sm hover:border-primary-300 hover:bg-primary-50"
                    >
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.role}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableCompetitions.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                  比赛经历
                </h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {availableCompetitions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleAddFromCompetition(c)}
                      className="rounded-lg border border-gray-200 p-3 text-left text-sm hover:border-primary-300 hover:bg-primary-50"
                    >
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">
                        {c.award && `${c.award} · `}
                        {c.level}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableProjects.length === 0 &&
              availableCompetitions.length === 0 && (
                <p className="text-sm text-gray-400">
                  暂无数据，请先在项目/比赛模块中添加记录
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
