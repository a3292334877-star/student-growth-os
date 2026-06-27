import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema/projects";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name, role, description, highlights, reflection,
      githubUrl, startDate, endDate, status,
    } = body;

    await db.insert(projects).values({
      userId: session.user.id,
      name,
      role: role || null,
      description: description || null,
      highlights: highlights || null,
      reflection: reflection || null,
      githubUrl: githubUrl || null,
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || "ongoing",
    });

    return NextResponse.json({ message: "创建成功" }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const projectList = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, session.user.id))
    .orderBy(projects.createdAt);

  return NextResponse.json(projectList);
}
