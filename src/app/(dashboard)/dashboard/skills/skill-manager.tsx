"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SkillTag } from "@/db/schema/skill-tags";
import { Plus, Trash2, BarChart3 } from "lucide-react";
import { SkillRadar } from "./skill-radar";

interface SkillManagerProps {
  initialSkills: SkillTag[];
}

const SKILL_CATEGORIES = [
  "编程语言",
  "前端开发",
  "后端开发",
  "数据库",
  "AI/ML",
  "工具链",
  "软技能",
  "其他",
];

export function SkillManager({ initialSkills }: SkillManagerProps) {
  const router = useRouter();
  const [skills, setSkills] = useState<SkillTag[]>(initialSkills);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [proficiency, setProficiency] = useState(3);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleAdd = useCallback(async () => {
    if (!name.trim()) return;
    setAdding(true);

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category: category || "其他",
          proficiency,
        }),
      });

      if (!res.ok) throw new Error("添加失败");

      setShowAdd(false);
      setName("");
      setCategory("");
      setProficiency(3);
      router.refresh();
    } catch {
      alert("添加失败");
    } finally {
      setAdding(false);
    }
  }, [name, category, proficiency, router]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("确定删除？")) return;
    setDeleting(id);

    try {
      await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      setSkills((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } catch {
      alert("删除失败");
    } finally {
      setDeleting(null);
    }
  }, [router]);

  // Group by category
  const grouped = skills.reduce(
    (acc, skill) => {
      const cat = skill.category || "其他";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {} as Record<string, SkillTag[]>,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* Skill List */}
      <div className="space-y-6">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          添加技能
        </button>

        {showAdd && (
          <div className="rounded-xl border bg-white p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500">技能名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="如：React, Python, 项目管理"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500">分类</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">选择分类</option>
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">
                    熟练度 (1-5)
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={proficiency}
                      onChange={(e) => setProficiency(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {proficiency}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleAdd}
                disabled={adding || !name.trim()}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {adding ? "添加中..." : "确认添加"}
              </button>
            </div>
          </div>
        )}

        {skills.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <BarChart3 className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">还没有添加技能</p>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat}>
              <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase">
                {cat}
              </h3>
              <div className="grid gap-2">
                {catSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        {skill.name}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-4 rounded-sm ${
                              i < skill.proficiency
                                ? "bg-primary-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      disabled={deleting === skill.id}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Radar Chart */}
      <div className="lg:sticky lg:top-6">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            能力雷达图
          </h3>
          <SkillRadar skills={skills} />
        </div>
      </div>
    </div>
  );
}
