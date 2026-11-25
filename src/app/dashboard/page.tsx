import type { Metadata } from "next";
import { db } from "@/db";
import { users, tasks, announcements, certificates } from "@/db/schema";
import { desc, eq, inArray, or } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TeamDashboard } from "@/components/dashboard/team-dashboard";

export const metadata: Metadata = { title: "Team Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const audience = user.role === "INTERN" ? ["ALL", "INTERNS"] as const : ["ALL", "EMPLOYEES"] as const;

  const [userTasks, notes, certs, mentor] = await Promise.all([
    db.select().from(tasks).where(eq(tasks.assigneeId, user.id)).orderBy(desc(tasks.createdAt)),
    db
      .select()
      .from(announcements)
      .where(or(inArray(announcements.audience, [...audience])))
      .orderBy(desc(announcements.createdAt))
      .limit(6),
    db.select().from(certificates).where(eq(certificates.userId, user.id)).orderBy(desc(certificates.issueDate)),
    user.mentorId
      ? db.select({ name: users.name, position: users.position }).from(users).where(eq(users.id, user.mentorId)).limit(1)
      : Promise.resolve([]),
  ]);

  return (
    <TeamDashboard
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        position: user.position,
        department: user.department,
        university: user.university,
        program: user.program,
        createdAt: user.createdAt.toISOString(),
      }}
      mentor={mentor[0] ?? null}
      tasks={userTasks.map((t) => ({
        id: t.id, title: t.title, description: t.description, status: t.status,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      }))}
      announcements={notes.map((a) => ({
        id: a.id, title: a.title, body: a.body, createdAt: a.createdAt.toISOString(),
      }))}
      certificates={certs.map((c) => ({
        id: c.id, title: c.title, program: c.program, credentialId: c.credentialId,
        issueDate: c.issueDate.toISOString(),
      }))}
    />
  );
}
