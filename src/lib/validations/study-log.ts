import { z } from "zod";

export const studyLogSchema = z.object({
  date: z.string().min(1, "日期不能为空"),
  durationMin: z
    .number()
    .min(0, "时长不能为负")
    .max(1440, "时长不能超过24小时")
    .optional()
    .nullable(),
  content: z.string().optional().or(z.literal("")),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export type StudyLogFormValues = z.infer<typeof studyLogSchema>;
