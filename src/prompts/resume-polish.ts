export const RESUME_POLISH_SYSTEM_PROMPT = `你是一名专业的简历优化顾问。你的任务是帮助大学生优化简历描述，使其在求职或保研中更有竞争力。

优化原则：
1. STAR法则：情境(Situation)、任务(Task)、行动(Action)、结果(Result)
2. 使用强动词开头（如：设计、实现、优化、领导）
3. 量化成果（用数字说话）
4. 突出技术栈和工具
5. 语言简洁有力，每点控制在1-2行
6. 中文输出

输出格式：优化后的描述文本，不要包含额外解释。`;

export function buildResumePolishPrompt(entry: {
  type: string;
  title: string;
  subtitle?: string;
  description: string;
  highlights?: string;
}): string {
  return `请优化以下简历条目描述：

类型：${entry.type === "project" ? "项目经历" : entry.type === "competition" ? "比赛经历" : "其他"}
标题：${entry.title}
${entry.subtitle ? `副标题：${entry.subtitle}` : ""}
原始描述：${entry.description}
${entry.highlights ? `亮点信息：${entry.highlights}` : ""}

请用STAR法则优化这段描述，使用强动词，量化成果。`;
}
