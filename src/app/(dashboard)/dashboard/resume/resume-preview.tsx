"use client";

import { useRef } from "react";
import type { ResumeEntry } from "@/db/schema/resume-entries";

interface ResumePreviewProps {
  title: string;
  entries: ResumeEntry[];
}

const SECTION_LABELS: Record<string, string> = {
  education: "教育背景",
  project: "项目经历",
  skill: "专业技能",
  honor: "荣誉证书",
};

export function ResumePreview({ title, entries }: ResumePreviewProps) {
  const groupedEntries = entries.reduce(
    (acc, entry) => {
      const section = entry.section || "other";
      if (!acc[section]) acc[section] = [];
      acc[section].push(entry);
      return acc;
    },
    {} as Record<string, ResumeEntry[]>,
  );

  const sectionOrder = ["education", "project", "skill", "honor"];

  return (
    <div className="mx-auto max-w-[800px] rounded-xl border bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sectionOrder.map((sectionKey) => {
          const sectionEntries = groupedEntries[sectionKey];
          if (!sectionEntries || sectionEntries.length === 0) return null;

          return (
            <div key={sectionKey}>
              <h2 className="mb-3 border-b pb-1 text-base font-bold text-gray-800">
                {SECTION_LABELS[sectionKey] || sectionKey}
              </h2>

              {sectionKey === "skill" ? (
                <div className="flex flex-wrap gap-2">
                  {sectionEntries.map((entry, i) => (
                    <span
                      key={entry.id || i}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {entry.title}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sectionEntries.map((entry, i) => (
                    <div key={entry.id || i}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {entry.title}
                          </h3>
                          {entry.subtitle && (
                            <p className="text-xs text-gray-500">
                              {entry.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      {(entry.aiOptimized || entry.description) && (
                        <p className="mt-1 text-sm leading-relaxed text-gray-700">
                          {entry.aiOptimized || entry.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {entries.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-400">暂无内容，请先添加条目</p>
        </div>
      )}
    </div>
  );
}
