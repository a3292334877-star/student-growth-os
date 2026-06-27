import { auth } from "./auth";
import { redirect } from "next/navigation";

/**
 * Get the authenticated user's ID, redirecting to login if not authenticated.
 * Use this in Server Components instead of manually checking session.
 */
export async function getRequiredUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
  return userId;
}

/**
 * Get the authenticated user's ID, returning null if not authenticated.
 * Use this in API routes where a 401 response is needed.
 */
export async function getOptionalUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
