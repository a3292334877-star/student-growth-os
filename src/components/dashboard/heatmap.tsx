"use client";

import { useMemo, useState } from "react";
import type { StudyLog } from "@/db/schema/study-logs";
import { Tooltip } from "@/components/ui/tooltip";

interface HeatmapProps {
  logs: StudyLog[];
  year?: number;
}

export function LearningHeatmap({ logs, year: propYear }: HeatmapProps) {
  const year = propYear ?? new Date().getFullYear();
  const [tooltip, setTooltip] = useState<{
    date: string;
    minutes: number;
    x: number;
    y: number;
  } | null>(null);

  const heatmapData = useMemo(() => {
    const dayMap = new Map<string, number>();
    for (const log of logs) {
      const existing = dayMap.get(log.date) ?? 0;
      dayMap.set(log.date, existing + (log.durationMin ?? 0));
    }
    return dayMap;
  }, [logs]);

  const weeks = useMemo(() => {
    const result: Array<{ days: Array<{ date: string; minutes: number } | null> }> = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Find the first Sunday on or before Jan 1
    const firstDay = new Date(startDate);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());

    const current = new Date(firstDay);
    while (current <= endDate) {
      const week: Array<{ date: string; minutes: number } | null> = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().split("T")[0];
        if (current.getFullYear() === year) {
          week.push({
            date: dateStr,
            minutes: heatmapData.get(dateStr) ?? 0,
          });
        } else {
          week.push(null);
        }
        current.setDate(current.getDate() + 1);
      }
      result.push({ days: week });
    }

    return result;
  }, [year, heatmapData]);

  const getColor = (minutes: number): string => {
    if (minutes === 0) return "bg-gray-100";
    if (minutes < 30) return "bg-green-200";
    if (minutes < 60) return "bg-green-300";
    if (minutes < 120) return "bg-green-400";
    if (minutes < 240) return "bg-green-500";
    return "bg-green-600";
  };

  const weekLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        {year}年 学习热力图
      </h3>
      <div className="flex gap-1">
        {/* Week labels */}
        <div className="flex flex-col gap-[3px] pt-0">
          {weekLabels.map((label, i) => (
            <div key={i} className="h-[14px] text-[10px] text-gray-400 leading-[14px]">
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-[3px] overflow-x-auto">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.days.map((day, di) => {
                if (!day) {
                  return <div key={di} className="h-[14px] w-[14px]" />;
                }
                return (
                  <div
                    key={day.date}
                    className={`relative h-[14px] w-[14px] rounded-sm ${getColor(day.minutes)} cursor-pointer transition-colors hover:ring-1 hover:ring-gray-400`}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({
                        date: day.date,
                        minutes: day.minutes,
                        x: rect.left,
                        y: rect.top - 40,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <span>少</span>
        <div className="h-3 w-3 rounded-sm bg-gray-100" />
        <div className="h-3 w-3 rounded-sm bg-green-200" />
        <div className="h-3 w-3 rounded-sm bg-green-300" />
        <div className="h-3 w-3 rounded-sm bg-green-400" />
        <div className="h-3 w-3 rounded-sm bg-green-500" />
        <div className="h-3 w-3 rounded-sm bg-green-600" />
        <span>多</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p>{tooltip.date}</p>
          <p>
            {tooltip.minutes > 0
              ? `${Math.round(tooltip.minutes / 60)}h ${tooltip.minutes % 60}m`
              : "无记录"}
          </p>
        </div>
      )}
    </div>
  );
}
