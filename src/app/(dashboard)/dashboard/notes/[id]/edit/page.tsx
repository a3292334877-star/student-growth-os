import { getRequiredUserId } from "@/lib/auth-helpers";
import { db } from "@/db";
import { notes } from "@/db/schema/notes";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditNoteClient } from "./edit-note-client";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getRequiredUserId();

  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .then((rows) => rows[0]);

  if (!note) {
    notFound();
  }

  return <EditNoteClient note={note} />;
}
