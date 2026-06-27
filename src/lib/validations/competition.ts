import { z } from "zod";

export const competitionSchema = z.object({
  name: z
    .string()
    .min(1, "比赛名称不能为空")
    .max(300, "比赛名称不能超过300字"),
  level: z.string().max(50).optional().or(z.literal("")),
  award: z.string().max(100).optional().or(z.literal("")),
  role: z.string().max(100).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  date: z.string().optional().or(z.literal("")),
  certificateUrl: z.string().url("请输入有效的URL").optional().or(z.literal("")),
});

export type CompetitionFormValues = z.infer<typeof competitionSchema>;
