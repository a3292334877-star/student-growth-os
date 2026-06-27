import type { User } from "next-auth";

export type AuthUser = User & {
  id: string;
};

export type PageProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type Semester = {
  value: string;
  label: string;
};

export const SEMESTERS: Semester[] = [
  { value: "2024-2025-1", label: "2024-2025 秋季学期" },
  { value: "2024-2025-2", label: "2024-2025 春季学期" },
  { value: "2025-2026-1", label: "2025-2026 秋季学期" },
  { value: "2025-2026-2", label: "2025-2026 春季学期" },
];

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type CompetitionLevel = "school" | "provincial" | "national" | "international";

export const COMPETITION_LEVELS: { value: CompetitionLevel; label: string }[] = [
  { value: "school", label: "校级" },
  { value: "provincial", label: "省级" },
  { value: "national", label: "国家级" },
  { value: "international", label: "国际级" },
];
