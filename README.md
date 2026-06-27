# 大学生成长OS (Student Growth OS)

帮助大学生系统化记录和管理大学生活，AI辅助生成成长报告、简历素材和成长轨迹分析。

## 功能特性

### MVP v1.0 核心功能

| 模块 | 功能 | 状态 |
|------|------|------|
| 用户系统 | 注册/登录、个人资料管理 | ✅ |
| 学习管理 | 课程记录、成绩管理、GPA计算 | ✅ |
| 学习日志 | 每日学习记录、日历视图、标签系统 | ✅ |
| 项目经历 | 项目CRUD、技术栈、GitHub链接 | ✅ |
| 比赛经历 | 竞赛记录、奖项级别管理 | ✅ |
| 证书管理 | 证书信息、图片链接 | ✅ |
| 数据看板 | 统计卡片、成长时间线 | ✅ |
| AI周报 | AI生成周报（M2） | 🚧 |
| AI月报 | AI生成月报（M2） | 🚧 |
| 简历素材 | 结构化简历 + AI润色（M3） | 🚧 |
| 技术笔记 | Markdown笔记（M3） | 🚧 |

## 技术栈

- **前端框架**: Next.js 15 (App Router) + React 19
- **样式方案**: Tailwind CSS 4 + Shadcn/ui
- **状态管理**: Zustand + TanStack Query
- **数据库**: PostgreSQL 16 (Neon)
- **ORM**: Drizzle ORM
- **认证**: NextAuth.js v5 (Credentials)
- **AI**: OpenAI GPT-4o / DeepSeek-V3
- **部署**: Vercel + Neon

## 快速开始

### 前置要求

- Node.js 22+
- pnpm 9+
- PostgreSQL 数据库（推荐使用 Neon）

### 安装

```bash
# 克隆项目
git clone <repo-url> student-growth-os
cd student-growth-os

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入数据库连接等信息

# 初始化数据库
pnpm db:push

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000

### 脚本说明

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | ESLint 检查 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm format` | Prettier 格式化 |
| `pnpm db:push` | 推送 schema 到数据库 |
| `pnpm db:generate` | 生成迁移文件 |
| `pnpm db:migrate` | 执行迁移 |
| `pnpm db:studio` | 启动 Drizzle Studio |
| `pnpm test` | 运行测试 |
| `pnpm test:e2e` | 运行 E2E 测试 |

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # 认证相关页面
│   ├── (dashboard)/        # Dashboard 布局和页面
│   └── api/                # API 路由
├── components/
│   ├── ui/                 # Shadcn UI 组件
│   ├── layout/             # 布局组件
│   ├── forms/              # 表单组件
│   ├── dashboard/          # 看板组件
│   └── shared/             # 共享组件
├── db/
│   ├── schema/             # Drizzle ORM Schema
│   └── index.ts            # 数据库连接
├── lib/
│   ├── auth.ts             # NextAuth 配置
│   ├── utils.ts            # 工具函数
│   └── validations/        # Zod 校验
├── hooks/                  # React Hooks
├── stores/                 # Zustand Stores
└── types/                  # TypeScript 类型
```

## 开发计划

| 里程碑 | 内容 | 周期 |
|--------|------|------|
| M0 | 基础设施搭建 | 第1周 |
| M1 | 用户系统 + 核心数据层 | 第2-3周 |
| M2 | AI能力 + 数据看板 | 第4-5周 |
| M3 | 简历素材 + 增强功能 | 第6-7周 |
| M4 | 打磨上线 | 第8周 |

## 许可证

MIT
