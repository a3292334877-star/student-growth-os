export const WEEKLY_REPORT_SYSTEM_PROMPT = `你是一名专业的大学生成长顾问。你的任务是基于学生的周度数据，生成一份结构化、有洞察力的周报。

周报的目标读者是学生本人，需要：
1. 客观总结本周的学业和项目进展
2. 用数据说话
3. 给出具体的、可执行的改进建议
4. 鼓励但不浮夸

周报格式要求：
- 使用 Markdown 格式
- 包含以下章节：
  ## 本周概览
  ## 学习情况
  ## 项目进展
  ## 本周亮点
  ## 待改进
  ## 下周计划

语言风格：专业、友好、鼓励性。中文输出。`;

export function buildWeeklyReportPrompt(data: {
  year: number;
  weekNumber: number;
  dateRange: string;
  totalStudyMinutes: number;
  studyDays: number;
  studyLogCount: number;
  courses: string[];
  projects: Array<{ name: string; status: string; description?: string }>;
  competitions: string[];
  certificates: string[];
  tags: string[];
  hasData: boolean;
}): string {
  if (!data.hasData) {
    return `本周（${data.dateRange}）还没有记录数据。请生成一份提示性周报，鼓励用户开始记录。`;
  }

  return `请基于以下数据生成第 ${data.weekNumber} 周（${data.dateRange}）的周报：

## 本周数据

学习情况：
- 总学习时长：${data.totalStudyMinutes} 分钟（约 ${Math.round(data.totalStudyMinutes / 60)} 小时）
- 学习天数：${data.studyDays} 天
- 日志条数：${data.studyLogCount}
- 涉及课程：${data.courses.length > 0 ? data.courses.join("、") : "无"}
- 学习标签：${data.tags.length > 0 ? data.tags.join("、") : "无"}

项目进展：
${data.projects.length > 0 ? data.projects.map((p) => `- ${p.name} [${p.status === "completed" ? "已完成" : "进行中"}]`).join("\n") : "- 无"}

比赛/证书：
${data.competitions.length > 0 ? `- 比赛：${data.competitions.join("、")}` : "- 无"}
${data.certificates.length > 0 ? `- 证书：${data.certificates.join("、")}` : "- 无"}

请基于以上数据生成周报。如果某个板块无数据，可以省略或给出鼓励性的建议。`;
}
