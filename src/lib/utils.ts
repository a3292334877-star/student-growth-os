import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatSemester(semester: string): string {
  const [year, term] = semester.split("-");
  const termLabel = term === "1" ? "秋季" : term === "2" ? "春季" : "夏季";
  return `${year}-${Number(year) + 1}学年 ${termLabel}学期`;
}

export function calculateGPA(courses: { credits: number | null; score: number | null }[]): {
  gpa: number;
  totalCredits: number;
} {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    if (course.credits && course.score) {
      totalPoints += course.credits * course.score;
      totalCredits += course.credits;
    }
  }

  return {
    gpa: totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0,
    totalCredits,
  };
}
