"use client";

import { useState, useMemo } from "react";
import type { StudyLog } from "@/db/schema/study-logs";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, BookOpen } from "lucide-react";

interface StudyLogCalendarProps {
  logs: StudyLog[];
}

export function StudyLogCalendar({ logs }: StudyLogCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const logMap = useMemo(() => {
    const map = new Map<string, StudyLog>();
    for (const log of logs) {
      map.set(log.date, log);
    }
    return map;
  }, [logs]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    calendarDays.push({ day: i, dateStr, log: logMap.get(dateStr) ?? null });
  }

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  const [selectedLog, setSelectedLog] = useState<StudyLog | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      {/* Calendar */}
      <div className="rounded-xl border bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-semibold">
            {format(new Date(currentYear, currentMonth), "yyyy年 M月", {
              locale: zhCN,
            })}
          </h3>
          <button
            onClick={nextMonth}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-gray-500">
          {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 text-center text-sm">
          {calendarDays.map((cell, i) => {
            if (!cell) {
              return <div key={`empty-${i}`} className="p-2" />;
            }

            const isToday =
              cell.dateStr === format(today, "yyyy-MM-dd");
            const hasLog = !!cell.log;

            return (
              <button
                key={cell.dateStr}
                onClick={() => cell.log && setSelectedLog(cell.log)}
                className={`relative rounded-lg p-2 text-sm transition-colors ${
                  isToday
                    ? "bg-primary-100 font-bold text-primary-700"
                    : hasLog
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "hover:bg-gray-50"
                }`}
              >
                {cell.day}
                {hasLog && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      <div className="rounded-xl border bg-white p-4">
        {selectedLog ? (
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              {selectedLog.date}
            </h4>
            <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {selectedLog.durationMin ?? 0} 分钟
              </span>
            </div>
            {selectedLog.tags && selectedLog.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {selectedLog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="prose prose-sm max-w-none text-gray-700">
              {selectedLog.content || "无详细内容"}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">
              点击日历中标记的日期查看日志
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
