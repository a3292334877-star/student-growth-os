export const MONTHLY_REPORT_SYSTEM_PROMPT = `你是一名专业的大学生成长顾问。你的任务是基于学生的月度数据，生成一份全面的月度成长报告。

月报的目标读者是学生本人，需要：
1. 全面总结本月的学业、项目、竞赛等各方面进展
2. 与上月进行对比分析
3. 识别成长趋势和模式
4. 给出战略性的建议
5. 帮助学生明确下月目标

月报格式要求：
- 使用 Markdown 格式
- 包含以下章节：
  ## 月度概览
  ## 学业分析
  ## 项目与竞赛
  ## 技能成长
  ## 与上月对比
  ## 成长建议
  ## 下月目标

语言风格：专业、有洞察力、鼓励性。中文输出。`;

export function buildMonthlyReportPrompt(data: {
  year: number;
  month: number;
  monthLabel: string;
  totalStudyMinutes: number;
  studyDays: number;
  studyLogCount: number;
  weeklyBreakdown: Array<{
    weekNumber: number;
    totalStudyMinutes: number;
    projectsUpdated: number;
  }>;
  courses: string[];
  newProjects: Array<{ name: string; status: string }>;
  completedProjects: string[];
  competitions: string[];
  certificates: string[];
  tags: string[];
  hasData: boolean;
}): string {
  if (!data.hasData) {
    return `${data.monthLabel} 还没有记录数据。请生成一份提示性月报，鼓励用户下月开始记录。`;
  }

  const weeklySummary = data.weeklyBreakdown
    .map(
      (w) =>
        `- 第${w.weekNumber}周：学习 ${Math.round(w.totalStudyMinutes / 60)} 小时，更新 ${w.projectsUpdated} 个项目`,
    )
    .join("\n");

  return `请基于以下数据生成 ${data.monthLabel} 的月报：

## 月度数据

学习情况：
- 总学习时长：${data.totalStudyMinutes} 分钟（约 ${Math.round(data.totalStudyMinutes / 60)} 小时）
- 学习天数：${data.studyDays} 天
- 日志条数：${data.studyLogCount}
- 涉及课程：${data.courses.length > 0 ? data.courses.join("、") : "无"}
- 学习标签：${data.tags.length > 0 ? data.tags.join("、") : "无"}

每周明细：
${weeklySummary}

项目进展：
- 新增项目：${data.newProjects.length > 0 ? data.newProjects.map((p) => `${p.name}[${p.status === "completed" ? "已完成" : "进行中"}]`).join("、") : "无"}
- 完成项目：${data.completedProjects.length > 0 ? data.completedProjects.join("、") : "无"}

比赛/证书：
- 比赛：${data.competitions.length > 0 ? data.competitions.join("、") : "无"}
- 证书：${data.certificates.length > 0 ? data.certificates.join("、") : "无"}

请基于以上数据生成月报。`;
}
