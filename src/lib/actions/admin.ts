"use server";

import { db, pool } from "@/db";
import {
  users, jobs, applications, projects, partners, services,
  contacts, announcements, tasks, certificates, settings, auditLogs,
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { requireRole, logAudit, hashPassword } from "@/lib/auth";
import { getStoredInquiries, markInquiryRead, deleteInquiry } from "@/lib/inquiries";
import { servicesFallback } from "@/lib/site";

type Ok = { ok: boolean; error?: string };

async function requireAdmin() {
  const session = await requireRole("ADMIN");
  if (!session) throw new Error("Unauthorized");
  return session;
}

/* ------------------------------- READS ------------------------------- */

export async function getAdminOverview() {
  await requireAdmin();
  if (pool) {
    try {
      const [userCount] = await db.select({ c: sql<number>`count(*)` }).from(users);
      const [appCount] = await db.select({ c: sql<number>`count(*)` }).from(applications);
      const [pendingCount] = await db
        .select({ c: sql<number>`count(*)` })
        .from(applications)
        .where(eq(applications.status, "PENDING"));
      const [msgCount] = await db.select({ c: sql<number>`count(*)` }).from(contacts);
      const recentApps = await db.select().from(applications).orderBy(desc(applications.createdAt)).limit(5);
      const recentAudit = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(8);
      const jobCount = await db.select({ c: sql<number>`count(*)` }).from(jobs);
      return {
        users: Number(userCount.c),
        applications: Number(appCount.c),
        pending: Number(pendingCount.c),
        messages: Number(msgCount.c),
        jobs: Number(jobCount[0]?.c || 0),
        recentApps: recentApps.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
        recentAudit: recentAudit.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
      };
    } catch (e) {
      console.warn("getAdminOverview DB error:", e);
    }
  }
  const stored = await getStoredInquiries();
  return {
    users: 1,
    applications: 0,
    pending: 0,
    messages: stored.length,
    jobs: 0,
    recentApps: [],
    recentAudit: [],
  };
}

export async function getUsers(role: "EMPLOYEE" | "INTERN" | "ADMIN") {
  await requireAdmin();
  if (pool) {
    try {
      const rows = await db.select().from(users).where(eq(users.role, role)).orderBy(desc(users.createdAt));
      return rows.map((u) => ({ ...u, passwordHash: undefined, createdAt: u.createdAt.toISOString() }));
    } catch (e) {
      console.warn("getUsers DB error:", e);
    }
  }
  if (role === "ADMIN") {
    return [
      {
        id: 1,
        name: "Wizzo Admin (AUR IFTI)",
        email: "aurifti@gmail.com",
        role: "ADMIN" as const,
        phone: "+880 1700-000000",
        position: "System Administrator",
        department: "Management",
        university: null,
        program: null,
        mentorId: null,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return [];
}

export async function getTeamOptions() {
  await requireAdmin();
  if (pool) {
    try {
      const rows = await db
        .select({ id: users.id, name: users.name, role: users.role })
        .from(users)
        .orderBy(users.name);
      return rows;
    } catch (e) {
      console.warn("getTeamOptions DB error:", e);
    }
  }
  return [{ id: 1, name: "Wizzo Admin", role: "ADMIN" as const }];
}

export async function adminCreateUser(data: {
  name: string; email: string; password: string;
  role: "EMPLOYEE" | "INTERN"; phone?: string; position?: string;
  department?: string; university?: string; program?: string; mentorId?: number | null;
}): Promise<Ok> {
  const admin = await requireAdmin();
  if (!data.name || !data.email || !data.password) return { ok: false, error: "Name, email and password are required." };
  if (data.password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  try {
    await db.insert(users).values({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: await hashPassword(data.password),
      role: data.role,
      phone: data.phone || null,
      position: data.position || null,
      department: data.department || null,
      university: data.university || null,
      program: data.program || null,
      mentorId: data.mentorId ?? null,
    });
    await logAudit(admin.uid, "USER_CREATE", `Created ${data.role} ${data.email}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "A user with this email already exists." };
  }
}

export async function adminSetUserStatus(id: number, status: "ACTIVE" | "DISABLED"): Promise<Ok> {
  const admin = await requireAdmin();
  await db.update(users).set({ status }).where(eq(users.id, id));
  await logAudit(admin.uid, "USER_STATUS", `User #${id} → ${status}`);
  return { ok: true };
}

export async function adminSetUserRole(id: number, role: "EMPLOYEE" | "INTERN" | "ADMIN"): Promise<Ok> {
  const admin = await requireAdmin();
  if (id === admin.uid && role !== "ADMIN") return { ok: false, error: "You cannot demote your own account." };
  await db.update(users).set({ role }).where(eq(users.id, id));
  await logAudit(admin.uid, "USER_ROLE", `User #${id} → ${role}`);
  return { ok: true };
}

export async function adminResetPassword(id: number, newPassword: string): Promise<Ok> {
  const admin = await requireAdmin();
  if (newPassword.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  await db.update(users).set({ passwordHash: await hashPassword(newPassword) }).where(eq(users.id, id));
  await logAudit(admin.uid, "PASSWORD_RESET", `Reset password for user #${id}`);
  return { ok: true };
}

export async function adminAssignMentor(internId: number, mentorId: number | null): Promise<Ok> {
  const admin = await requireAdmin();
  await db.update(users).set({ mentorId }).where(eq(users.id, internId));
  await logAudit(admin.uid, "MENTOR_ASSIGN", `Intern #${internId} mentor → #${mentorId}`);
  return { ok: true };
}

export async function adminDeleteUser(id: number): Promise<Ok> {
  const admin = await requireAdmin();
  if (id === admin.uid) return { ok: false, error: "You cannot delete your own account." };
  await db.delete(tasks).where(eq(tasks.assigneeId, id));
  await db.delete(certificates).where(eq(certificates.userId, id));
  await db.delete(users).where(eq(users.id, id));
  await logAudit(admin.uid, "USER_DELETE", `Deleted user #${id}`);
  return { ok: true };
}

/* ----------------------------- APPLICATIONS ----------------------------- */

export async function getApplications(status?: string) {
  await requireAdmin();
  if (pool) {
    try {
      const rows = await db.select().from(applications).orderBy(desc(applications.createdAt));
      const mapped = rows.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }));
      return status && status !== "ALL" ? mapped.filter((a) => a.status === status) : mapped;
    } catch (e) {
      console.warn("getApplications DB error:", e);
    }
  }
  return [];
}

export async function adminSetApplicationStatus(
  id: number,
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "APPROVED" | "REJECTED"
): Promise<Ok> {
  const admin = await requireAdmin();
  await db.update(applications).set({ status }).where(eq(applications.id, id));
  await logAudit(admin.uid, "APPLICATION_STATUS", `Application #${id} → ${status}`);
  return { ok: true };
}

export async function adminDeleteApplication(id: number): Promise<Ok> {
  const admin = await requireAdmin();
  await db.delete(applications).where(eq(applications.id, id));
  await logAudit(admin.uid, "APPLICATION_DELETE", `Deleted application #${id}`);
  return { ok: true };
}

/* --------------------------------- JOBS --------------------------------- */

export async function adminGetJobs() {
  await requireAdmin();
  if (pool) {
    try {
      const rows = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
      return rows.map((j) => ({ ...j, deadline: j.deadline ? j.deadline.toISOString() : null, createdAt: j.createdAt.toISOString() }));
    } catch (e) {
      console.warn("adminGetJobs DB error:", e);
    }
  }
  return [];
}

export async function adminSaveJob(data: {
  id?: number; title: string; type: "INTERNSHIP" | "FULL_TIME"; category: string;
  location: string; description: string; requirements: string; deadline?: string; open: boolean;
}): Promise<Ok> {
  const admin = await requireAdmin();
  if (!data.title || !data.description) return { ok: false, error: "Title and description are required." };
  const payload = {
    title: data.title, type: data.type, category: data.category || "General",
    location: data.location || "Dhaka, Bangladesh", description: data.description,
    requirements: data.requirements || "", deadline: data.deadline ? new Date(data.deadline) : null,
    open: data.open,
  };
  if (data.id) {
    await db.update(jobs).set(payload).where(eq(jobs.id, data.id));
    await logAudit(admin.uid, "JOB_UPDATE", `Updated job #${data.id}`);
  } else {
    await db.insert(jobs).values(payload);
    await logAudit(admin.uid, "JOB_CREATE", `Created job ${data.title}`);
  }
  return { ok: true };
}

export async function adminToggleJob(id: number, open: boolean): Promise<Ok> {
  const admin = await requireAdmin();
  await db.update(jobs).set({ open }).where(eq(jobs.id, id));
  await logAudit(admin.uid, "JOB_TOGGLE", `Job #${id} → ${open ? "open" : "closed"}`);
  return { ok: true };
}

export async function adminDeleteJob(id: number): Promise<Ok> {
  const admin = await requireAdmin();
  await db.delete(jobs).where(eq(jobs.id, id));
  await logAudit(admin.uid, "JOB_DELETE", `Deleted job #${id}`);
  return { ok: true };
}

/* -------------------------------- CONTENT -------------------------------- */

export async function getContent() {
  await requireAdmin();
  if (pool) {
    try {
      const [svc, prj, ptr] = await Promise.all([
        db.select().from(services).orderBy(services.order),
        db.select().from(projects).orderBy(projects.order),
        db.select().from(partners).orderBy(partners.order),
      ]);
      return {
        services: svc,
        projects: prj.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() })),
        partners: ptr,
      };
    } catch (e) {
      console.warn("getContent DB error:", e);
    }
  }
  return {
    services: servicesFallback.map((s, i) => ({ id: i + 1, ...s, order: i, active: true })),
    projects: [],
    partners: [],
  };
}

export async function adminSaveService(data: {
  id?: number; title: string; description: string; details?: string;
  icon?: string; order?: number; active?: boolean;
}): Promise<Ok> {
  const admin = await requireAdmin();
  if (!data.title || !data.description) return { ok: false, error: "Title and description are required." };
  const payload = {
    title: data.title, description: data.description, details: data.details ?? "",
    icon: data.icon || "Code2", order: data.order ?? 0, active: data.active ?? true,
  };
  if (data.id) await db.update(services).set(payload).where(eq(services.id, data.id));
  else await db.insert(services).values(payload);
  await logAudit(admin.uid, "SERVICE_SAVE", data.title);
  return { ok: true };
}

export async function adminDeleteService(id: number): Promise<Ok> {
  const admin = await requireAdmin();
  await db.delete(services).where(eq(services.id, id));
  await logAudit(admin.uid, "SERVICE_DELETE", `Service #${id}`);
  return { ok: true };
}

const gradients = [
  "from-[#0755F5] to-[#102542]", "from-[#00B8D9] to-[#0755F5]", "from-[#102542] to-[#3d78ff]",
  "from-[#7A5CFF] to-[#0755F5]", "from-[#0755F5] to-[#00E0A4]", "from-[#FF7A59] to-[#0755F5]",
];

export async function adminSaveProject(data: {
  id?: number; title: string; category: string; description: string;
  techStack: string; liveUrl?: string; order?: number;
}): Promise<Ok> {
  const admin = await requireAdmin();
  if (!data.title || !data.description) return { ok: false, error: "Title and description are required." };
  const payload = {
    title: data.title, category: data.category || "Web", description: data.description,
    techStack: data.techStack || "", liveUrl: data.liveUrl || null,
    gradient: gradients[(data.order ?? 0) % gradients.length], order: data.order ?? 0,
  };
  if (data.id) await db.update(projects).set(payload).where(eq(projects.id, data.id));
  else await db.insert(projects).values(payload);
  await logAudit(admin.uid, "PROJECT_SAVE", data.title);
  return { ok: true };
}

export async function adminDeleteProject(id: number): Promise<Ok> {
  const admin = await requireAdmin();
  await db.delete(projects).where(eq(projects.id, id));
  await logAudit(admin.uid, "PROJECT_DELETE", `Project #${id}`);
  return { ok: true };
}

export async function adminSavePartner(data: {
  id?: number; name: string; glyph?: string; websiteUrl?: string; order?: number; active?: boolean;
}): Promise<Ok> {
  const admin = await requireAdmin();
  if (!data.name) return { ok: false, error: "Partner name is required." };
  const payload = {
    name: data.name, glyph: data.glyph || data.name.charAt(0).toUpperCase(),
    websiteUrl: data.websiteUrl || null, order: data.order ?? 0, active: data.active ?? true,
  };
  if (data.id) await db.update(partners).set(payload).where(eq(partners.id, data.id));
  else await db.insert(partners).values(payload);
  await logAudit(admin.uid, "PARTNER_SAVE", data.name);
  return { ok: true };
}

export async function adminDeletePartner(id: number): Promise<Ok> {
  const admin = await requireAdmin();
  await db.delete(partners).where(eq(partners.id, id));
  await logAudit(admin.uid, "PARTNER_DELETE", `Partner #${id}`);
  return { ok: true };
}

/* ------------------------------ TASKS & OPS ------------------------------ */

export async function adminGetTasks() {
  await requireAdmin();
  if (pool) {
    try {
      const rows = await db
        .select({
          id: tasks.id, title: tasks.title, description: tasks.description, status: tasks.status,
          dueDate: tasks.dueDate, assigneeId: tasks.assigneeId, assigneeName: users.name,
        })
        .from(tasks)
        .innerJoin(users, eq(tasks.assigneeId, users.id))
        .orderBy(desc(tasks.createdAt));
      return rows.map((t) => ({ ...t, dueDate: t.dueDate ? t.dueDate.toISOString() : null }));
    } catch (e) {
      console.warn("adminGetTasks DB error:", e);
    }
  }
  return [];
}

export async function adminAssignTask(data: {
  title: string; description?: string; assigneeId: number; dueDate?: string;
}): Promise<Ok> {
  const admin = await requireAdmin();
  if (!data.title || !data.assigneeId) return { ok: false, error: "Title and assignee are required." };
  await db.insert(tasks).values({
    title: data.title, description: data.description ?? "",
    assigneeId: data.assigneeId, dueDate: data.dueDate ? new Date(data.dueDate) : null,
  });
  await logAudit(admin.uid, "TASK_ASSIGN", `Task "${data.title}" → user #${data.assigneeId}`);
  return { ok: true };
}

export async function adminDeleteTask(id: number): Promise<Ok> {
  const admin = await requireAdmin();
  await db.delete(tasks).where(eq(tasks.id, id));
  return { ok: true };
}

export async function adminGetAnnouncements() {
  await requireAdmin();
  if (pool) {
    try {
      const rows = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
      return rows.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }));
    } catch (e) {
      console.warn("adminGetAnnouncements DB error:", e);
    }
  }
  return [];
}

export async function adminCreateAnnouncement(data: {
  title: string; body: string; audience: "ALL" | "EMPLOYEES" | "INTERNS";
}): Promise<Ok> {
  const admin = await requireAdmin();
  if (!data.title || !data.body) return { ok: false, error: "Title and message are required." };
  await db.insert(announcements).values(data);
  await logAudit(admin.uid, "ANNOUNCEMENT", data.title);
  return { ok: true };
}

export async function adminDeleteAnnouncement(id: number): Promise<Ok> {
  const admin = await requireAdmin();
  await db.delete(announcements).where(eq(announcements.id, id));
  return { ok: true };
}

export async function adminGetCertificates() {
  await requireAdmin();
  if (pool) {
    try {
      const rows = await db
        .select({
          id: certificates.id, userId: certificates.userId, userName: users.name,
          title: certificates.title, program: certificates.program,
          credentialId: certificates.credentialId, issueDate: certificates.issueDate,
        })
        .from(certificates)
        .innerJoin(users, eq(certificates.userId, users.id))
        .orderBy(desc(certificates.issueDate));
      return rows.map((c) => ({ ...c, issueDate: c.issueDate.toISOString() }));
    } catch (e) {
      console.warn("adminGetCertificates DB error:", e);
    }
  }
  return [];
}

export async function adminIssueCertificate(data: {
  userId: number; title: string; program?: string;
}): Promise<Ok> {
  const admin = await requireAdmin();
  if (!data.userId || !data.title) return { ok: false, error: "User and title are required." };
  await db.insert(certificates).values({
    userId: data.userId, title: data.title, program: data.program || null,
    credentialId: `WZ-${String(data.userId).padStart(4, "0")}-${Date.now().toString(36).toUpperCase()}`,
  });
  await logAudit(admin.uid, "CERTIFICATE", `Issued "${data.title}" → user #${data.userId}`);
  return { ok: true };
}

export async function adminDeleteCertificate(id: number): Promise<Ok> {
  const admin = await requireAdmin();
  await db.delete(certificates).where(eq(certificates.id, id));
  return { ok: true };
}

/* ------------------------------- MESSAGES & INQUIRIES ------------------------------- */

export async function getContacts() {
  await requireAdmin();
  if (pool) {
    try {
      const rows = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
      if (rows && rows.length > 0) {
        return rows.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }));
      }
    } catch (e) {
      console.warn("DB query failed for contacts, falling back to local store:", e);
    }
  }
  return await getStoredInquiries();
}

export async function adminMarkContact(id: number, read: boolean): Promise<Ok> {
  await requireAdmin();
  if (pool) {
    try {
      await db.update(contacts).set({ read }).where(eq(contacts.id, id));
    } catch (e) {
      console.warn("DB update contact failed:", e);
    }
  }
  await markInquiryRead(id, read);
  return { ok: true };
}

export async function adminDeleteContact(id: number): Promise<Ok> {
  const admin = await requireAdmin();
  if (pool) {
    try {
      await db.delete(contacts).where(eq(contacts.id, id));
      await logAudit(admin.uid, "CONTACT_DELETE", `Message #${id}`);
    } catch (e) {
      console.warn("DB delete contact failed:", e);
    }
  }
  await deleteInquiry(id);
  return { ok: true };
}

/* ------------------------------- SETTINGS ------------------------------- */

export async function getSettings() {
  await requireAdmin();
  if (pool) {
    try {
      const rows = await db.select().from(settings);
      return Object.fromEntries(rows.map((r) => [r.key, r.value]));
    } catch (e) {
      console.warn("getSettings DB error:", e);
    }
  }
  return {};
}

export async function adminSaveSettings(pairs: Record<string, string>): Promise<Ok> {
  const admin = await requireAdmin();
  for (const [key, value] of Object.entries(pairs)) {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
  }
  await logAudit(admin.uid, "SETTINGS_SAVE", Object.keys(pairs).join(", "));
  return { ok: true };
}
