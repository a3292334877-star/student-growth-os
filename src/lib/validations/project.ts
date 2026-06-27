import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "项目名称不能为空")
    .max(300, "项目名称不能超过300字"),
  role: z.string().max(100).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  highlights: z.string().optional().or(z.literal("")),
  reflection: z.string().optional().or(z.literal("")),
  githubUrl: z.string().url("请输入有效的URL").optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  status: z.enum(["ongoing", "completed"]).default("ongoing"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
