import { z } from "zod";

export const courseSchema = z.object({
  name: z
    .string()
    .min(1, "课程名称不能为空")
    .max(200, "课程名称不能超过200字"),
  teacher: z.string().max(100, "教师姓名不能超过100字").optional().or(z.literal("")),
  credits: z
    .number()
    .min(0, "学分不能为负")
    .max(30, "学分不能超过30")
    .optional()
    .nullable(),
  score: z
    .number()
    .min(0, "成绩不能为负")
    .max(100, "成绩不能超过100")
    .optional()
    .nullable(),
  semester: z.string().optional().or(z.literal("")),
  category: z.string().max(50).optional().or(z.literal("")),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
