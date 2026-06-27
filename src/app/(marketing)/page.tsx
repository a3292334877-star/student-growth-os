import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  FileText,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
      {/* Navigation */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-gray-900">大学生成长OS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              免费注册
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
          记录成长轨迹
          <br />
          <span className="text-primary-600">AI 助力</span> 展示最好的自己
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          大学生成长OS 帮助你系统化记录学习、项目、竞赛经历，
          AI 自动生成周报月报和简历素材，让每一份努力都被看见。
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-200 hover:bg-primary-700"
          >
            免费开始使用
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-gray-300 px-8 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50"
          >
            已有账号？登录
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          一站式成长管理
        </h2>
        <p className="mt-4 text-center text-gray-600">
          从记录到展示，覆盖大学生涯全场景
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "多维度记录",
              desc: "课程、项目、竞赛、证书、学习日志，系统化记录大学四年所有经历",
            },
            {
              icon: Sparkles,
              title: "AI 智能分析",
              desc: "AI 自动生成周报/月报，分析成长趋势，润色简历描述（GPT-4o 加持）",
            },
            {
              icon: BarChart3,
              title: "数据可视化",
              desc: "学习热力图、能力雷达图、成长时间线，直观看到自己的进步",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-xl bg-primary-50 p-3">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Resume Builder Highlight */}
      <section className="bg-primary-600 py-20">
        <div className="mx-auto max-w-6xl px-4 text-center text-white">
          <h2 className="text-3xl font-bold">简历素材一键生成</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            从你记录的项目和经历中，AI 自动生成结构化简历素材，
            使用 STAR 法则优化描述，让面试官眼前一亮
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-700 hover:bg-primary-50"
          >
            开始创建简历
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          适合这样的你
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "大一新生", desc: "从零开始规划大学生活，记录每一份努力" },
            { title: "大二/大三", desc: "积累项目经验，定期产出成长报告" },
            { title: "应届求职", desc: "系统化简历素材，AI 优化面试准备" },
            { title: "保研考研", desc: "综合素质材料一键导出，展示竞争力" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border bg-white p-6 text-center"
            >
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-semibold text-gray-900">
                大学生成长OS
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-700">
                隐私政策
              </Link>
              <span>Student Growth OS &copy; 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
