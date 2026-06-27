import { auth } from "@/lib/auth";
import { db } from "@/db";
import { skillTags } from "@/db/schema/skill-tags";
import { eq } from "drizzle-orm";
import { EmptyState } from "@/components/shared/empty-state";
import { SkillManager } from "./skill-manager";

export default async function SkillsPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const skills = await db
    .select()
    .from(skillTags)
    .where(eq(skillTags.userId, userId))
    .orderBy(skillTags.proficiency);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">技能管理</h2>
        <p className="mt-1 text-sm text-gray-500">
          管理你的技能标签和能力雷达
        </p>
      </div>

      <SkillManager initialSkills={skills} />
    </div>
  );
}
