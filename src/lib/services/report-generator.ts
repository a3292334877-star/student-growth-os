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
      // Use AI if available, otherwise use template fallback
      let content: string;

      if (ai.isAvailable()) {
        const result = await ai.generate(
          WEEKLY_REPORT_SYSTEM_PROMPT,
          prompt,
          { temperature: 0.7 },
        );
        content = result.content;
      } else {
        content = this.generateFallbackWeekly(data);
      }

      if (existing) {
        await db
          .update(weeklyReports)
          .set({
            aiContent: content,
            rawData: data as unknown as Record<string, unknown>,
            updatedAt: new Date(),
          })
          .where(eq(weeklyReports.id, existing.id));
      } else {
        await db.insert(weeklyReports).values({
          userId: this.userId,
          year,
          weekNumber,
          aiContent: content,
          rawData: data as unknown as Record<string, unknown>,
          status: "draft",
        });
      }

      return { content, success: true };
    } catch (error) {
      console.error("Generate weekly report error:", error);
      // Final fallback
      const fallback = this.generateFallbackWeekly(data);
      return { content: fallback, success: true };
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
      let content: string;

      if (ai.isAvailable()) {
        const result = await ai.generate(
          MONTHLY_REPORT_SYSTEM_PROMPT,
          prompt,
          { temperature: 0.7, maxTokens: 8192 },
        );
        content = result.content;
      } else {
        content = this.generateFallbackMonthly(data);
      }

      if (existing) {
        await db
          .update(monthlyReports)
          .set({
            aiContent: content,
            rawData: data as unknown as Record<string, unknown>,
            updatedAt: new Date(),
          })
          .where(eq(monthlyReports.id, existing.id));
      } else {
        await db.insert(monthlyReports).values({
          userId: this.userId,
          year,
          month,
          aiContent: content,
          rawData: data as unknown as Record<string, unknown>,
          status: "draft",
        });
      }

      return { content, success: true };
    } catch (error) {
      console.error("Generate monthly report error:", error);
      const fallback = this.generateFallbackMonthly(data);
      return { content: fallback, success: true };
    }
  }

  /**
   * Fallback template-based weekly report (no AI API key needed)
   */
  private generateFallbackWeekly(data: {
    dateRange: string; totalStudyMinutes: number; studyDays: number; studyLogCount: number;
    courses: string[]; projects: Array<{ name: string; status: string }>;
    competitions: string[]; certificates: string[]; tags: string[]; hasData: boolean;
  }): string {
    const hours = Math.round(data.totalStudyMinutes / 60);
    const minutes = data.totalStudyMinutes % 60;

    let report = `## 本周概览\n\n`;
    report += `**统计周期**: ${data.dateRange}\n\n`;

    if (!data.hasData) {
      report += `本周暂无学习记录。建议每天花10分钟记录学习内容，积累成长数据。\n\n`;
      report += `## 下周计划\n\n`;
      report += `- 设定每天的学习目标\n`;
      report += `- 记录学习内容和时长\n`;
      report += `- 开始一个小项目或实验\n`;
      return report;
    }

    report += `### 学习情况\n\n`;
    report += `- 总学习时长：${hours}小时${minutes}分钟\n`;
    report += `- 学习天数：${data.studyDays}天\n`;
    report += `- 日志条数：${data.studyLogCount}条\n`;
    if (data.courses.length > 0) {
      report += `- 涉及课程：${data.courses.join("、")}\n`;
    }
    if (data.tags.length > 0) {
      report += `- 学习标签：${data.tags.join("、")}\n`;
    }

    if (data.projects.length > 0) {
      report += `\n### 项目进展\n\n`;
      for (const p of data.projects) {
        const status = p.status === "completed" ? "✅ 已完成" : "🔄 进行中";
        report += `- ${p.name} [${status}]\n`;
      }
    }

    if (data.competitions.length > 0) {
      report += `\n### 比赛与证书\n\n`;
      report += `- 比赛：${data.competitions.join("、")}\n`;
    }
    if (data.certificates.length > 0) {
      report += `- 证书：${data.certificates.join("、")}\n`;
    }

    if (hours >= 10) {
      report += `\n### 本周亮点\n\n💪 本周学习时长超过10小时，保持了良好的学习节奏！\n`;
    } else if (hours >= 5) {
      report += `\n### 本周亮点\n\n👍 本周学习投入稳定，继续保持！\n`;
    } else {
      report += `\n### 待改进\n\n⏰ 本周学习时间较少，建议每天安排固定时间段学习。\n`;
    }

    report += `\n### 下周计划\n\n`;
    report += `- 保持每天的学习习惯\n`;
    report += `- 尝试将学到的知识应用到项目中\n`;
    report += `- 定期回顾和总结\n`;

    return report;
  }

  /**
   * Fallback template-based monthly report (no AI API key needed)
   */
  private generateFallbackMonthly(data: {
    monthLabel: string; totalStudyMinutes: number; studyDays: number; studyLogCount: number;
    courses: string[]; completedProjects: string[]; competitions: string[]; certificates: string[];
    tags: string[]; hasData: boolean;
  }): string {
    const hours = Math.round(data.totalStudyMinutes / 60);

    let report = `## ${data.monthLabel}成长月报\n\n`;

    if (!data.hasData) {
      report += `本月暂无记录。\n\n`;
      report += `### 下月目标\n\n`;
      report += `1. 开始记录学习日志\n`;
      report += `2. 设定月度学习目标\n`;
      report += `3. 尝试参与一个项目或比赛\n`;
      return report;
    }

    report += `### 月度概览\n\n`;
    report += `- 总学习时长：${hours}小时\n`;
    report += `- 学习天数：${data.studyDays}天\n`;
    report += `- 日志条数：${data.studyLogCount}条\n`;

    if (data.courses.length > 0) {
      report += `- 涉及课程：${data.courses.length}门\n`;
    }
    if (data.tags.length > 0) {
      report += `- 技能标签：${data.tags.join("、")}\n`;
    }

    if (data.completedProjects.length > 0) {
      report += `\n### 成果产出\n\n`;
      report += `项目完成：${data.completedProjects.join("、")}\n`;
    }

    if (data.competitions.length > 0 || data.certificates.length > 0) {
      report += `\n### 荣誉记录\n\n`;
      if (data.competitions.length > 0) report += `- 比赛：${data.competitions.join("、")}\n`;
      if (data.certificates.length > 0) report += `- 证书：${data.certificates.join("、")}\n`;
    }

    const dailyAvg = data.studyDays > 0 ? Math.round(hours / data.studyDays * 10) / 10 : 0;
    report += `\n### 成长分析\n\n`;
    report += `日均学习 ${dailyAvg} 小时，`;
    if (dailyAvg >= 3) {
      report += `学习强度很高，继续保持！`;
    } else if (dailyAvg >= 1) {
      report += `学习状态良好，有提升空间。`;
    } else {
      report += `建议增加每天的学习时间。`;
    }

    report += `\n\n### 下月目标\n\n`;
    report += `1. 持续积累学习记录\n`;
    report += `2. 推进项目进展\n`;
    report += `3. 关注技能提升方向\n`;

    return report;
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
