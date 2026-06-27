"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  NotebookPen,
  CalendarCheck,
  ScrollText,
} from "lucide-react";

const mobileNavItems = [
  { href: "/dashboard", label: "首页", icon: LayoutDashboard },
  { href: "/dashboard/learning/courses", label: "学习", icon: BookOpen },
  { href: "/dashboard/projects", label: "项目", icon: FolderKanban },
  { href: "/dashboard/learning/logs", label: "日志", icon: NotebookPen },
  { href: "/dashboard/reports/weekly", label: "周报", icon: CalendarCheck },
  { href: "/dashboard/reports/monthly", label: "月报", icon: ScrollText },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-xs",
                isActive
                  ? "text-primary-600"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
