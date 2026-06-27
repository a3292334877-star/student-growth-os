"use client";

import { useMemo } from "react";
import type { SkillTag } from "@/db/schema/skill-tags";

interface SkillRadarProps {
  skills: SkillTag[];
}

export function SkillRadar({ skills }: SkillRadarProps) {
  const chartData = useMemo(() => {
    // Average proficiency by category
    const categoryMap = new Map<string, number[]>();
    for (const skill of skills) {
      const cat = skill.category || "其他";
      if (!categoryMap.has(cat)) categoryMap.set(cat, []);
      categoryMap.get(cat)!.push(skill.proficiency);
    }

    return Array.from(categoryMap.entries())
      .map(([category, proficiencies]) => ({
        category,
        average:
          Math.round(
            (proficiencies.reduce((a, b) => a + b, 0) / proficiencies.length) *
              10,
          ) / 10,
        count: proficiencies.length,
      }))
      .sort((a, b) => b.average - a.average);
  }, [skills]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-sm text-gray-400">暂无数据</p>
      </div>
    );
  }

  // Simple horizontal bar chart instead of radar (no external chart lib needed)
  const maxAvg = Math.max(...chartData.map((d) => d.average), 5);

  return (
    <div className="space-y-3">
      {chartData.map((item) => (
        <div key={item.category}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-gray-700">{item.category}</span>
            <span className="text-gray-500">
              {item.average.toFixed(1)} ({item.count}项)
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all"
              style={{ width: `${(item.average / 5) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
