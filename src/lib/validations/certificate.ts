import { z } from "zod";

export const certificateSchema = z.object({
  name: z
    .string()
    .min(1, "证书名称不能为空")
    .max(300, "证书名称不能超过300字"),
  issuer: z.string().max(200).optional().or(z.literal("")),
  certNumber: z.string().max(100).optional().or(z.literal("")),
  issueDate: z.string().optional().or(z.literal("")),
  expireDate: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url("请输入有效的URL").optional().or(z.literal("")),
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;
