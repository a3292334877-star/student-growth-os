"use client";

import type { Competition } from "@/db/schema/competitions";
import { formatDate } from "@/lib/utils";
import { Trash2, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { COMPETITION_LEVELS } from "@/types";

interface CompetitionListProps {
  competitions: Competition[];
}

const levelColorMap: Record<string, string> = {
  school: "bg-gray-50 text-gray-700",
  provincial: "bg-blue-50 text-blue-700",
  national: "bg-amber-50 text-amber-700",
  international: "bg-purple-50 text-purple-700",
};

export function CompetitionList({ competitions }: CompetitionListProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("确定删除这条记录？")) return;
    setDeleting(id);

    try {
      await fetch(`/api/competitions/${id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      alert("删除失败");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {competitions.map((comp) => {
        const levelLabel = COMPETITION_LEVELS.find((l) => l.value === comp.level)?.label ?? comp.level;
        return (
          <div
            key={comp.id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-amber-50 p-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{comp.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {comp.level && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${levelColorMap[comp.level] || "bg-gray-50 text-gray-700"}`}
                      >
                        {levelLabel}
                      </span>
                    )}
                    {comp.award && (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        {comp.award}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(comp.id)}
                disabled={deleting === comp.id}
                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {comp.description && (
              <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                {comp.description}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>{comp.role || "参赛者"}</span>
              <span>{comp.date ? formatDate(comp.date) : ""}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
