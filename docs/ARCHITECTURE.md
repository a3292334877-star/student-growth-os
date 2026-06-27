# 系统架构文档

## 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│            PC Browser          Mobile Browser                │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Application Layer                          │
│                     Next.js 15 App Router                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Components (SSR)   │  Client Components      │   │
│  │  - Dashboard               │  - Forms                │   │
│  │  - Course List             │  - Calendar             │   │
│  │  - Timeline                │  - Markdown Editor      │   │
│  └────────────────────────────┴────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Actions / API Routes                          │   │
│  │  - Auth (NextAuth)    - CRUD (Drizzle ORM)           │   │
│  │  - File Upload        - AI Proxy                     │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Data Layer                                │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  PostgreSQL     │  │  Redis        │  │  Object Store  │  │
│  │  (Neon)         │  │  (Upstash)    │  │  (R2/S3)       │  │
│  │  - User Data    │  │  - Session    │  │  - Images      │  │
│  │  - Business Data│  │  - Cache      │  │  - Attachments │  │
│  └────────────────┘  └──────────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## 目录架构说明

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Route Group: 认证页面
│   │   ├── login/              # 登录页
│   │   └── register/           # 注册页
│   ├── (dashboard)/            # Route Group: 需要认证的页面
│   │   ├── dashboard/          # Dashboard 页面
│   │   ├── learning/           # 学习模块
│   │   │   ├── courses/        # 课程管理
│   │   │   └── logs/           # 学习日志
│   │   ├── projects/           # 项目管理
│   │   ├── achievements/       # 成就管理
│   │   │   ├── competitions/   # 比赛经历
│   │   │   └── certificates/   # 证书管理
│   │   ├── notes/              # 技术笔记
│   │   ├── reports/            # 周报/月报
│   │   ├── resume/             # 简历素材
│   │   └── settings/           # 用户设置
│   └── api/                    # API Routes
│       ├── auth/               # 认证 API
│       ├── courses/            # 课程 API
│       ├── study-logs/         # 日志 API
│       ├── projects/           # 项目 API
│       ├── competitions/       # 比赛 API
│       ├── certificates/       # 证书 API
│       └── user/               # 用户 API
├── components/                 # React 组件
│   ├── ui/                     # Shadcn UI 基础组件
│   ├── layout/                 # 布局组件（Sidebar, Navbar, MobileNav）
│   ├── forms/                  # 表单组件
│   ├── dashboard/              # Dashboard 组件（StatsCards, Timeline）
│   └── shared/                 # 共享组件（EmptyState, Loading）
├── db/                         # 数据库
│   ├── schema/                 # Drizzle ORM Schema
│   └── index.ts                # 数据库连接
├── lib/                        # 通用库
│   ├── auth.ts                 # NextAuth 配置
│   ├── utils.ts                # 工具函数
│   └── validations/            # Zod 校验 Schema
├── hooks/                      # 自定义 Hooks
├── stores/                     # Zustand 状态管理
└── types/                      # TypeScript 类型定义
```

## 数据流

### 页面渲染
```
Request → Server Component → Server Action/DB Query → HTML/Stream
```

### 表单提交
```
User Input → Client Validation (Zod) → Server Action (Zod re-validate)
    → DB Mutation → Revalidate Path → UI Update
```

### AI 调用 (M2)
```
User Request → Collect User Data → Build Prompt → Call AI API
    → Parse Response → Save to DB → Display to User
```

## 数据库设计

参见 `src/db/schema/` 下的 Schema 定义文件。

核心实体关系：
- User 1:N Course, StudyLog, Project, Competition, Certificate
- User 1:N WeeklyReport, MonthlyReport
- User 1:N Resume 1:N ResumeEntry
- ResumeEntry 可选引用 Project/Competition

## 认证流程

1. 用户提交邮箱+密码
2. NextAuth Credentials Provider 校验
3. JWT Token 签发
4. 中间件自动检查 session
5. 未登录重定向到 /login

## 环境变量

参见 `.env.example`
