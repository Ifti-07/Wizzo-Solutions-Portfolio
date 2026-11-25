"use server";

import { db, pool } from "@/db";
import { contacts, applications } from "@/db/schema";
import { saveInquiry } from "@/lib/inquiries";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export type ActionResult = { ok: boolean; error?: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) return { ok: false, error: "Please fill in your name, email and message." };
    if (!emailRe.test(email)) return { ok: false, error: "Please enter a valid email address." };

    if (pool) {
      try {
        await db.insert(contacts).values({ name, email, phone, company, service, message });
      } catch (err) {
        console.warn("DB insert contacts failed, saving to file:", err);
      }
    }
    await saveInquiry({ name, email, phone, company, service, message });
    return { ok: true };
  } catch (e) {
    console.error("contact submit failed", e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function submitApplication(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const position = String(formData.get("position") || "").trim();
    if (!fullName || !email || !phone || !position)
      return { ok: false, error: "Name, email, phone and position are required." };
    if (!emailRe.test(email)) return { ok: false, error: "Please enter a valid email address." };

    // Optional CV upload
    let cvPath: string | null = null;
    const cv = formData.get("cv");
    if (cv instanceof File && cv.size > 0) {
      if (cv.size > 5 * 1024 * 1024) return { ok: false, error: "CV must be smaller than 5MB." };
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (cv.type && !allowed.includes(cv.type))
        return { ok: false, error: "CV must be a PDF, DOC or DOCX file." };
      const safe = cv.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const dir = path.join(process.cwd(), "uploads", "cv");
      await mkdir(dir, { recursive: true });
      const fileName = `${Date.now()}-${safe}`;
      await writeFile(path.join(dir, fileName), Buffer.from(await cv.arrayBuffer()));
      cvPath = fileName;
    }

    const jobIdRaw = String(formData.get("jobId") || "");
    await db.insert(applications).values({
      jobId: jobIdRaw ? Number(jobIdRaw) : null,
      fullName,
      email,
      phone,
      university: String(formData.get("university") || "").trim() || null,
      department: String(formData.get("department") || "").trim() || null,
      educationLevel: String(formData.get("educationLevel") || "").trim() || null,
      position,
      skills: String(formData.get("skills") || "").trim() || null,
      portfolioUrl: String(formData.get("portfolioUrl") || "").trim() || null,
      cvPath,
      message: String(formData.get("message") || "").trim() || null,
    });
    return { ok: true };
  } catch (e) {
    console.error("application submit failed", e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
