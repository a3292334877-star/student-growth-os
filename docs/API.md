# API 文档

## 认证 API

### POST /api/auth/register
注册新用户

```json
{
  "email": "user@school.edu.cn",
  "password": "password123",
  "name": "张三"
}
```

### POST /api/auth/[...nextauth]
NextAuth 认证端点

### GET/POST /api/auth/signout
登出

## 课程 API

### GET /api/courses
获取课程列表

### POST /api/courses
创建课程

```json
{
  "name": "数据结构与算法",
  "teacher": "王教授",
  "credits": 3.0,
  "score": 92.5,
  "semester": "2024-2025-1",
  "category": "major"
}
```

### PUT /api/courses/:id
更新课程

### DELETE /api/courses/:id
删除课程

## 学习日志 API

### GET /api/study-logs
获取日志列表

### POST /api/study-logs
创建日志

```json
{
  "date": "2024-09-15",
  "durationMin": 120,
  "content": "## 今日学习\n- 学习了红黑树...",
  "tags": ["数据结构", "算法"]
}
```

### PUT /api/study-logs/:id
更新日志

### DELETE /api/study-logs/:id
删除日志

## 项目 API

### GET /api/projects
获取项目列表

### POST /api/projects
创建项目

```json
{
  "name": "校园二手交易平台",
  "role": "后端开发",
  "description": "...",
  "highlights": "...",
  "reflection": "...",
  "githubUrl": "https://github.com/...",
  "startDate": "2024-03-01",
  "endDate": "2024-06-30",
  "status": "completed"
}
```

### PUT /api/projects/:id
更新项目

### DELETE /api/projects/:id
删除项目

## 比赛 API

### GET /api/competitions
获取比赛列表

### POST /api/competitions
创建比赛记录

```json
{
  "name": "全国大学生数学建模竞赛",
  "level": "national",
  "award": "国家一等奖",
  "role": "队长",
  "description": "...",
  "date": "2024-09-10",
  "certificateUrl": "https://..."
}
```

### DELETE /api/competitions/:id
删除比赛记录

## 证书 API

### GET /api/certificates
获取证书列表

### POST /api/certificates
创建证书记录

```json
{
  "name": "CET-6",
  "issuer": "教育部考试中心",
  "certNumber": "123456",
  "issueDate": "2024-06-15",
  "expireDate": "",
  "imageUrl": "https://..."
}
```

### DELETE /api/certificates/:id
删除证书记录

## 用户 API

### PUT /api/user/profile
更新个人资料

```json
{
  "name": "张三",
  "school": "XX大学",
  "major": "计算机科学与技术",
  "grade": "2022级"
}
```
