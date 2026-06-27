import { formatDate } from "@/lib/utils";
import type { Course } from "@/db/schema/courses";
import type { Project } from "@/db/schema/projects";
import type { Competition } from "@/db/schema/competitions";
import type { Certificate } from "@/db/schema/certificates";
import { BookOpen, FolderKanban, Trophy, GraduationCap } from "lucide-react";

interface TimelineProps {
  courses: Course[];
  projects: Project[];
  competitions: Competition[];
  certificates: Certificate[];
}

type TimelineEvent = {
  date: Date;
  title: string;
  subtitle: string;
  type: "course" | "project" | "competition" | "certificate";
};

export function Timeline({
  courses,
  projects,
  competitions,
  certificates,
}: TimelineProps) {
  const events: TimelineEvent[] = [
    ...courses.map((c) => ({
      date: new Date(c.createdAt),
      title: c.name,
      subtitle: `成绩: ${c.score ?? "未录入"} | 学分: ${c.credits ?? "-"}`,
      type: "course" as const,
    })),
    ...projects.map((p) => ({
      date: new Date(p.createdAt),
      title: p.name,
      subtitle: p.role ?? "",
      type: "project" as const,
    })),
    ...competitions.map((c) => ({
      date: new Date(c.createdAt),
      title: c.name,
      subtitle: c.award ?? "",
      type: "competition" as const,
    })),
    ...certificates.map((c) => ({
      date: new Date(c.createdAt),
      title: c.name,
      subtitle: c.issuer ?? "",
      type: "certificate" as const,
    })),
  ];

  events.sort((a, b) => b.date.getTime() - a.date.getTime());

  const recentEvents = events.slice(0, 10);

  const iconMap = {
    course: BookOpen,
    project: FolderKanban,
    competition: Trophy,
    certificate: GraduationCap,
  };

  const colorMap = {
    course: "text-blue-600 bg-blue-50",
    project: "text-purple-600 bg-purple-50",
    competition: "text-amber-600 bg-amber-50",
    certificate: "text-rose-600 bg-rose-50",
  };

  if (recentEvents.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-gray-500">还没有记录，开始添加你的第一条数据吧</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">最近动态</h3>
      <div className="space-y-4">
        {recentEvents.map((event, index) => {
          const Icon = iconMap[event.type];
          return (
            <div key={index} className="flex items-start gap-4">
              <div className={`rounded-lg p-2 ${colorMap[event.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {event.title}
                </p>
                <p className="text-xs text-gray-500">{event.subtitle}</p>
              </div>
              <span className="whitespace-nowrap text-xs text-gray-400">
                {formatDate(event.date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
