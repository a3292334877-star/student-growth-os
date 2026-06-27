import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { certificates } from "@/db/schema/certificates";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, issuer, certNumber, issueDate, expireDate, imageUrl } = body;

    await db.insert(certificates).values({
      userId: session.user.id,
      name,
      issuer: issuer || null,
      certNumber: certNumber || null,
      issueDate: issueDate || null,
      expireDate: expireDate || null,
      imageUrl: imageUrl || null,
    });

    return NextResponse.json({ message: "创建成功" }, { status: 201 });
  } catch (error) {
    console.error("Create certificate error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const certList = await db
    .select()
    .from(certificates)
    .where(eq(certificates.userId, session.user.id))
    .orderBy(certificates.createdAt);

  return NextResponse.json(certList);
}
