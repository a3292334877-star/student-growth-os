import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAIProvider } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  RESUME_POLISH_SYSTEM_PROMPT,
  buildResumePolishPrompt,
} from "@/prompts";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const rateCheck = await checkRateLimit(session.user.id, "polish");
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "请求太频繁，请稍后再试" },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const { type, title, subtitle, description, highlights } = body;

    if (!description) {
      return NextResponse.json(
        { error: "描述不能为空" },
        { status: 400 },
      );
    }

    const ai = getAIProvider();
    const prompt = buildResumePolishPrompt({
      type: type || "project",
      title: title || "",
      subtitle: subtitle || "",
      description: description || "",
      highlights: highlights || "",
    });

    const result = await ai.generate(
      RESUME_POLISH_SYSTEM_PROMPT,
      prompt,
      { temperature: 0.7, maxTokens: 1024 },
    );

    return NextResponse.json({ optimized: result.content.trim() });
  } catch (error) {
    console.error("Polish error:", error);
    return NextResponse.json(
      { error: "润色失败，请稍后重试" },
      { status: 500 },
    );
  }
}
