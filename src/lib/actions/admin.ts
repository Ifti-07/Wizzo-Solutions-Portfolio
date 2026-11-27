"use server";

import { db, pool } from "@/db";
import {
  users, jobs, applications, projects, partners, services,
  contacts, settings, auditLogs,
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { requireRole, logAudit } from "@/lib/auth";
import { getStoredInquiries, markInquiryRead, deleteInquiry } from "@/lib/inquiries";
import {
  getStoredJobs,
  saveStoredJob,
  toggleStoredJob,
  deleteStoredJob,
} from "@/lib/jobs-store";
import { servicesFallback } from "@/lib/site";
import { ensureDatabaseSchema } from "@/db/auto-migrate";

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
      await ensureDatabaseSchema();
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
        users: Number(userCount?.c || 0),
        applications: Number(appCount?.c || 0),
        pending: Number(pendingCount?.c || 0),
        messages: Number(msgCount?.c || 0),
        jobs: Number(jobCount[0]?.c || 0),
        recentApps: recentApps.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
        recentAudit: recentAudit.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
      };
    } catch (e) {
      console.warn("getAdminOverview DB error:", e);
    }
  }
  const stored = await getStoredInquiries();
  const fileJobs = await getStoredJobs();
  return {
    users: 1,
    applications: 0,
    pending: 0,
    messages: stored.length,
    jobs: fileJobs.length,
    recentApps: [],
    recentAudit: [],
  };
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
      await ensureDatabaseSchema();
      const rows = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
      if (rows && rows.length > 0) {
        return rows.map((j) => ({
          ...j,
          deadline: j.deadline ? j.deadline.toISOString() : null,
          createdAt: j.createdAt.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("adminGetJobs DB notice:", e);
    }
  }
  return await getStoredJobs();
}

export async function adminSaveJob(data: {
  id?: number;
  title: string;
  type: "INTERNSHIP" | "FULL_TIME";
  category: string;
  location: string;
  description: string;
  requirements: string;
  deadline?: string;
  open: boolean;
}): Promise<Ok> {
  try {
    const admin = await requireAdmin();
    if (!data.title?.trim() || !data.description?.trim()) {
      return { ok: false, error: "Title and description are required." };
    }
    const payload = {
      title: data.title.trim(),
      type: data.type || "INTERNSHIP",
      category: data.category?.trim() || "Engineering",
      location: data.location?.trim() || "Dhaka, Bangladesh",
      description: data.description.trim(),
      requirements: data.requirements?.trim() || "",
      deadline: data.deadline ? new Date(data.deadline) : null,
      open: data.open,
    };

    if (pool) {
      try {
        await ensureDatabaseSchema();
        if (data.id) {
          await db.update(jobs).set(payload).where(eq(jobs.id, data.id));
          await logAudit(admin.uid, "JOB_UPDATE", `Updated job #${data.id}`);
        } else {
          await db.insert(jobs).values(payload);
          await logAudit(admin.uid, "JOB_CREATE", `Created job ${data.title}`);
        }
      } catch (e) {
        console.warn("adminSaveJob DB notice:", e);
      }
    }

    await saveStoredJob({
      id: data.id,
      title: payload.title,
      type: payload.type,
      category: payload.category,
      location: payload.location,
      description: payload.description,
      requirements: payload.requirements,
      deadline: payload.deadline ? payload.deadline.toISOString() : null,
      open: payload.open,
    });

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to save opening." };
  }
}

export async function adminToggleJob(id: number, open: boolean): Promise<Ok> {
  try {
    const admin = await requireAdmin();
    if (pool) {
      try {
        await ensureDatabaseSchema();
        await db.update(jobs).set({ open }).where(eq(jobs.id, id));
        await logAudit(admin.uid, "JOB_TOGGLE", `Job #${id} → ${open ? "open" : "closed"}`);
      } catch (e) {
        console.warn("adminToggleJob DB notice:", e);
      }
    }
    await toggleStoredJob(id, open);
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to toggle status." };
  }
}

export async function adminDeleteJob(id: number): Promise<Ok> {
  try {
    const admin = await requireAdmin();
    if (pool) {
      try {
        await ensureDatabaseSchema();
        await db.delete(jobs).where(eq(jobs.id, id));
        await logAudit(admin.uid, "JOB_DELETE", `Deleted job #${id}`);
      } catch (e) {
        console.warn("adminDeleteJob DB notice:", e);
      }
    }
    await deleteStoredJob(id);
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to delete opening." };
  }
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

/* ------------------------------- MESSAGES & INQUIRIES ------------------------------- */

export async function getContacts() {
  await requireAdmin();
  if (pool) {
    try {
      await ensureDatabaseSchema();
      const rows = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
      return (rows || []).map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }));
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
