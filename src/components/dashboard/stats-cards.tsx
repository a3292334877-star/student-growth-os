import { BookOpen, FolderKanban, Trophy, GraduationCap, Clock, Sparkles } from "lucide-react";

interface StatsCardsProps {
  courseCount: number;
  totalStudyHours: number;
  projectCount: number;
  completedProjects: number;
  competitionCount: number;
  certificateCount: number;
}

export function StatsCards({
  courseCount,
  totalStudyHours,
  projectCount,
  completedProjects,
  competitionCount,
  certificateCount,
}: StatsCardsProps) {
  const cards = [
    {
      label: "课程",
      value: courseCount,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "学习时长",
      value: `${totalStudyHours}h`,
      icon: Clock,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "项目",
      value: projectCount,
      sub: `${completedProjects} 已完成`,
      icon: FolderKanban,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "比赛",
      value: competitionCount,
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "证书",
      value: certificateCount,
      icon: GraduationCap,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "AI报告",
      value: "准备就绪",
      icon: Sparkles,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{card.label}</span>
            <div className={`rounded-lg p-1.5 ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
          {card.sub && (
            <p className="text-xs text-gray-500">{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
