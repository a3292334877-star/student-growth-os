import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, school, major, grade } = body;

    await db
      .update(users)
      .set({
        name: name || null,
        school: school || null,
        major: major || null,
        grade: grade || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ message: "更新成功" });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
