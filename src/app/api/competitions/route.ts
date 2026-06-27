import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { competitions } from "@/db/schema/competitions";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, level, award, role, description, date, certificateUrl } = body;

    await db.insert(competitions).values({
      userId: session.user.id,
      name,
      level: level || null,
      award: award || null,
      role: role || null,
      description: description || null,
      date: date || null,
      certificateUrl: certificateUrl || null,
    });

    return NextResponse.json({ message: "创建成功" }, { status: 201 });
  } catch (error) {
    console.error("Create competition error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const competitionList = await db
    .select()
    .from(competitions)
    .where(eq(competitions.userId, session.user.id))
    .orderBy(competitions.createdAt);

  return NextResponse.json(competitionList);
}
