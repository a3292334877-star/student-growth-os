"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Trophy,
  FileText,
  NotebookPen,
  CalendarCheck,
  ScrollText,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "首页", icon: LayoutDashboard },
  { href: "/dashboard/learning/courses", label: "课程", icon: BookOpen },
  { href: "/dashboard/learning/logs", label: "学习日志", icon: NotebookPen },
  { href: "/dashboard/projects", label: "项目经历", icon: FolderKanban },
  { href: "/dashboard/skills", label: "技能管理", icon: BarChart3 },
  { href: "/dashboard/achievements/competitions", label: "比赛经历", icon: Trophy },
  { href: "/dashboard/achievements/certificates", label: "证书", icon: GraduationCap },
  { href: "/dashboard/notes", label: "技术笔记", icon: FileText },
  { href: "/dashboard/reports/weekly", label: "周报", icon: CalendarCheck },
  { href: "/dashboard/reports/monthly", label: "月报", icon: ScrollText },
  { href: "/dashboard/resume", label: "简历素材", icon: ScrollText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-white">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <GraduationCap className="h-6 w-6 text-primary-600" />
        <span className="text-lg font-bold text-gray-900">成长OS</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t px-3 py-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="h-4 w-4" />
          设置
        </Link>
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </Link>
      </div>
    </aside>
  );
}
