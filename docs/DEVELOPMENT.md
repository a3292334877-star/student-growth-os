# 开发指南

## 开发环境搭建

### 1. 安装依赖

```bash
pnpm install
```

### 2. 环境变量

复制 `.env.example` 为 `.env.local`，填入必要的环境变量：

```bash
cp .env.example .env.local
```

最小配置只需要：
- `DATABASE_URL` — Neon PostgreSQL 连接字符串
- `AUTH_SECRET` — 任意 32 位随机字符串

### 3. 数据库初始化

```bash
# 推送 schema 到数据库（创建表）
pnpm db:push

# 查看数据库（可选）
pnpm db:studio
```

### 4. 启动开发服务器

```bash
pnpm dev
```

## 代码规范

### TypeScript

- 严格模式开启
- 优先使用 `type` 而非 `interface`（类型需要联合/交叉时用 type）
- Server Component 和 Client Component 明确标注

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `CourseForm.tsx` |
| 工具函数 | camelCase | `formatDate.ts` |
| 数据库 Schema | snake_case 表名 | `study_logs` |
| API Routes | kebab-case 目录 | `study-logs/` |
| 类型 | PascalCase | `CourseFormValues` |

### 组件规范

1. **Server Component 优先** — 尽量使用 Server Component 减少客户端 JS
2. **"use client" 最小化** — 只在需要交互/状态时标注
3. **服务端数据获取** — 在 Server Component 中直接查询数据库
4. **表单校验** — 使用 Zod 在客户端 + 服务端双重校验

### 开发流程

1. 创建功能分支: `feature/xxx` 或 `fix/xxx`
2. 开发、自测
3. 提交 PR → CI 自动检查
4. Code Review → Merge

## 测试

```bash
# 单元测试
pnpm test

# E2E 测试
pnpm test:e2e
```

## 部署

### Vercel 自动部署

1. 在 Vercel 导入 GitHub 仓库
2. 配置环境变量
3. 推送到 `main` 分支自动部署

### 手动构建

```bash
pnpm build
pnpm start
```

## 常见问题

### Q: 数据库连接失败
检查 `.env.local` 中 `DATABASE_URL` 是否正确

### Q: 注册后登录失败
确认 `AUTH_SECRET` 已正确设置

### Q: TypeScript 类型错误
运行 `pnpm type-check` 查看详细错误
