"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function updateTaskStatus(taskId: number, status: "TODO" | "IN_PROGRESS" | "DONE") {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not authenticated" };
  const where =
    session.role === "ADMIN"
      ? eq(tasks.id, taskId)
      : and(eq(tasks.id, taskId), eq(tasks.assigneeId, session.uid));
  await db.update(tasks).set({ status }).where(where);
  return { ok: true };
}
