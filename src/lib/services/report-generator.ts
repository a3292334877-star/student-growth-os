import { getAIProvider } from "@/lib/ai";
import { db } from "@/db";
import { studyLogs } from "@/db/schema/study-logs";
import { projects } from "@/db/schema/projects";
import { courses } from "@/db/schema/courses";
import { competitions } from "@/db/schema/competitions";
import { certificates } from "@/db/schema/certificates";
import { weeklyReports } from "@/db/schema/weekly-reports";
import { monthlyReports } from "@/db/schema/monthly-reports";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import {
  WEEKLY_REPORT_SYSTEM_PROMPT,
  buildWeeklyReportPrompt,
  MONTHLY_REPORT_SYSTEM_PROMPT,
  buildMonthlyReportPrompt,
} from "@/prompts";

export class ReportGenerator {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Get the start and end dates for a given ISO week
   */
  private getWeekDateRange(year: number, week: number): { start: string; end: string } {
    const firstDay = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7;
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() + daysOffset);
    // Adjust to Monday
    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + mondayOffset);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    };
  }

  /**
   * Get the month label in Chinese
   */
  private getMonthLabel(year: number, month: number): string {
    const labels = [
      "一月", "二月", "三月", "四月", "五月", "六月",
      "七月", "八月", "九月", "十月", "十一月", "十二月",
    ];
    return `${year}年${labels[month - 1]}`;
  }

  /**
   * Gather weekly data for report generation
   */
  async gatherWeeklyData(year: number, weekNumber: number) {
    const { start, end } = this.getWeekDateRange(year, weekNumber);

    const [logs, projectList, courseList, competitionList, certList] =
      await Promise.all([
        db
          .select()
          .from(studyLogs)
          .where(
            and(
              eq(studyLogs.userId, this.userId),
              gte(studyLogs.date, start),
              lte(studyLogs.date, end),
            ),
          ),
        db
          .select()
          .from(projects)
          .where(eq(projects.userId, this.userId)),
        db
          .select()
          .from(courses)
          .where(eq(courses.userId, this.userId)),
        db
          .select()
          .from(competitions)
          .where(eq(competitions.userId, this.userId)),
        db
          .select()
          .from(certificates)
          .where(eq(certificates.userId, this.userId)),
      ]);

    const totalStudyMinutes = logs.reduce(
      (sum, log) => sum + (log.durationMin ?? 0),
      0,
    );
    const studyDays = new Set(logs.map((l) => l.date)).size;
    const allTags = logs.flatMap((l) => l.tags ?? []);
    const uniqueTags = [...new Set(allTags)];

    const hasData =
      logs.length > 0 ||
      totalStudyMinutes > 0 ||
      projectList.length > 0;

    return {
      year,
      weekNumber,
      dateRange: `${start} ~ ${end}`,
      totalStudyMinutes,
      studyDays,
      studyLogCount: logs.length,
      courses: courseList.map((c) => c.name),
      projects: projectList.map((p) => ({
        name: p.name,
        status: p.status ?? "ongoing",
        description: p.description ?? undefined,
      })),
      competitions: competitionList.map((c) => c.name),
      certificates: certList.map((c) => c.name),
      tags: uniqueTags,
      hasData,
    };
  }

  /**
   * Gather monthly data for report generation
   */
  async gatherMonthlyData(year: number, month: number) {
    const monthStr = `${year}-${String(month).padStart(2, "0")}`;
    const start = `${monthStr}-01`;

    // Calculate end date
    const endDate = new Date(year, month, 0);
    const end = endDate.toISOString().split("T")[0];

    const [logs, projectList, courseList, competitionList, certList] =
      await Promise.all([
        db
          .select()
          .from(studyLogs)
          .where(
            and(
              eq(studyLogs.userId, this.userId),
              gte(studyLogs.date, start),
              lte(studyLogs.date, end),
            ),
          ),
        db
          .select()
          .from(projects)
          .where(eq(projects.userId, this.userId)),
        db
          .select()
          .from(courses)
          .where(eq(courses.userId, this.userId)),
        db
          .select()
          .from(competitions)
          .where(eq(competitions.userId, this.userId)),
        db
          .select()
          .from(certificates)
          .where(eq(certificates.userId, this.userId)),
      ]);

    const totalStudyMinutes = logs.reduce(
      (sum, log) => sum + (log.durationMin ?? 0),
      0,
    );
    const studyDays = new Set(logs.map((l) => l.date)).size;
    const allTags = logs.flatMap((l) => l.tags ?? []);
    const uniqueTags = [...new Set(allTags)];

    // Weekly breakdown
    const weeklyBreakdown: Array<{
      weekNumber: number;
      totalStudyMinutes: number;
      projectsUpdated: number;
    }> = [];

    // Calculate which weeks fall in this month
    const startDate = new Date(start);
    const weekStart = new Date(startDate);
    let weekCounter = 1;

    while (weekStart <= endDate) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekLogs = logs.filter((log) => {
        return log.date >= weekStart.toISOString().split("T")[0] &&
          log.date <= weekEnd.toISOString().split("T")[0];
      });

      if (weekLogs.length > 0) {
        weeklyBreakdown.push({
          weekNumber: weekCounter,
          totalStudyMinutes: weekLogs.reduce(
            (sum, log) => sum + (log.durationMin ?? 0),
            0,
          ),
          projectsUpdated: projectList.filter((p) => {
            const updated = new Date(p.updatedAt);
            return updated >= weekStart && updated <= weekEnd;
          }).length,
        });
      }

      weekStart.setDate(weekStart.getDate() + 7);
      weekCounter++;
    }

    const newProjects = projectList.filter((p) => {
      const created = new Date(p.createdAt);
      return created >= startDate && created <= endDate;
    });

    const completedProjects = projectList
      .filter((p) => p.status === "completed")
      .map((p) => p.name);

    const hasData =
      logs.length > 0 || projectList.length > 0 || courseList.length > 0;

    return {
      year,
      month,
      monthLabel: this.getMonthLabel(year, month),
      totalStudyMinutes,
      studyDays,
      studyLogCount: logs.length,
      weeklyBreakdown,
      courses: courseList.map((c) => c.name),
      newProjects: newProjects.map((p) => ({
        name: p.name,
        status: p.status ?? "ongoing",
      })),
      completedProjects,
      competitions: competitionList.map((c) => c.name),
      certificates: certList.map((c) => c.name),
      tags: uniqueTags,
      hasData,
    };
  }

  /**
   * Generate a weekly report
   */
  async generateWeeklyReport(
    year: number,
    weekNumber: number,
  ): Promise<{ content: string; success: boolean }> {
    const data = await this.gatherWeeklyData(year, weekNumber);

    // Check if report already exists
    const existing = await db
      .select()
      .from(weeklyReports)
      .where(
        and(
          eq(weeklyReports.userId, this.userId),
          eq(weeklyReports.year, year),
          eq(weeklyReports.weekNumber, weekNumber),
        ),
      )
      .then((rows) => rows[0]);

    const ai = getAIProvider();
    const prompt = buildWeeklyReportPrompt(data);

    try {
      const result = await ai.generate(
        WEEKLY_REPORT_SYSTEM_PROMPT,
        prompt,
        { temperature: 0.7 },
      );

      if (existing) {
        await db
          .update(weeklyReports)
          .set({
            aiContent: result.content,
            rawData: data as unknown as Record<string, unknown>,
            updatedAt: new Date(),
          })
          .where(eq(weeklyReports.id, existing.id));
      } else {
        await db.insert(weeklyReports).values({
          userId: this.userId,
          year,
          weekNumber,
          aiContent: result.content,
          rawData: data as unknown as Record<string, unknown>,
          status: "draft",
        });
      }

      return { content: result.content, success: true };
    } catch (error) {
      console.error("Generate weekly report error:", error);
      return {
        content: "周报生成失败，请稍后重试。",
        success: false,
      };
    }
  }

  /**
   * Generate a monthly report
   */
  async generateMonthlyReport(
    year: number,
    month: number,
  ): Promise<{ content: string; success: boolean }> {
    const data = await this.gatherMonthlyData(year, month);

    const existing = await db
      .select()
      .from(monthlyReports)
      .where(
        and(
          eq(monthlyReports.userId, this.userId),
          eq(monthlyReports.year, year),
          eq(monthlyReports.month, month),
        ),
      )
      .then((rows) => rows[0]);

    const ai = getAIProvider();
    const prompt = buildMonthlyReportPrompt(data);

    try {
      const result = await ai.generate(
        MONTHLY_REPORT_SYSTEM_PROMPT,
        prompt,
        { temperature: 0.7, maxTokens: 8192 },
      );

      if (existing) {
        await db
          .update(monthlyReports)
          .set({
            aiContent: result.content,
            rawData: data as unknown as Record<string, unknown>,
            updatedAt: new Date(),
          })
          .where(eq(monthlyReports.id, existing.id));
      } else {
        await db.insert(monthlyReports).values({
          userId: this.userId,
          year,
          month,
          aiContent: result.content,
          rawData: data as unknown as Record<string, unknown>,
          status: "draft",
        });
      }

      return { content: result.content, success: true };
    } catch (error) {
      console.error("Generate monthly report error:", error);
      return {
        content: "月报生成失败，请稍后重试。",
        success: false,
      };
    }
  }

  /**
   * Get week number for a date
   */
  static getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (24 * 60 * 60 * 1000));
    return Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
  }

  static getCurrentYearAndWeek(): { year: number; week: number } {
    const now = new Date();
    return {
      year: now.getFullYear(),
      week: ReportGenerator.getWeekNumber(now),
    };
  }

  static getCurrentYearAndMonth(): { year: number; month: number } {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    };
  }
}
