import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { courses } from "@/db/schema/courses";
import { courseSchema } from "@/lib/validations/course";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = courseSchema.parse(body);

    await db.insert(courses).values({
      userId: session.user.id,
      name: validated.name,
      teacher: validated.teacher || null,
      credits: validated.credits?.toString() ?? null,
      score: validated.score?.toString() ?? null,
      semester: validated.semester || null,
      category: validated.category || null,
    });

    return NextResponse.json({ message: "添加成功" }, { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const courseList = await db
    .select()
    .from(courses)
    .where(eq(courses.userId, session.user.id))
    .orderBy(courses.createdAt);

  return NextResponse.json(courseList);
}
