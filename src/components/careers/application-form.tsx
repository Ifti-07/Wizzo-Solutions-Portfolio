"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { UploadCloud, Send, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { submitApplication } from "@/lib/actions/public";
import type { JobItem } from "./jobs-list";

const inputCls =
  "w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-3 outline-none transition-all focus:border-electric focus:ring-4 focus:ring-electric/15 dark:bg-surface";

const educationLevels = [
  "1st Year Undergraduate", "2nd Year Undergraduate", "3rd Year Undergraduate",
  "4th Year Undergraduate", "Fresh Graduate", "Master's Student", "Other",
];

export function ApplicationForm({ job, allJobs }: { job: JobItem | null; allJobs: JobItem[] }) {
  const [state, action, pending] = useActionState(submitApplication, null);
  const [cvName, setCvName] = useState("");

  if (state?.ok) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-line bg-surface p-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 size={30} />
        </span>
        <h2 className="font-display mt-6 text-2xl font-bold text-ink">Application Submitted</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          Thank you for applying to Wizzo Solutions. Our HR team will review your application and
          contact shortlisted candidates by email.
        </p>
        <Link
          href="/careers"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={15} /> Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-3xl border border-line bg-surface p-6 md:p-9">
      <input type="hidden" name="jobId" value={job?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Full Name *</label>
          <input name="fullName" required placeholder="Your full name" className={inputCls} />
        </div>
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Email Address *</label>
          <input name="email" type="email" required placeholder="you@email.com" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Phone Number *</label>
          <input name="phone" required placeholder="+880 ..." className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">University</label>
          <input name="university" placeholder="Your university" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Department</label>
          <input name="department" placeholder="e.g. CSE" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Current Education Level</label>
          <select name="educationLevel" className={inputCls} defaultValue="">
            <option value="" disabled>Select level</option>
            {educationLevels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Position Applied For *</label>
          <select name="position" required className={inputCls} defaultValue={job?.title ?? ""}>
            <option value="" disabled>Select a position</option>
            {allJobs.map((j) => <option key={j.id} value={j.title}>{j.title}</option>)}
            <option value="General Application">General Application</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Skills</label>
          <input name="skills" placeholder="e.g. HTML, CSS, JavaScript, React, Figma" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Portfolio / LinkedIn URL</label>
          <input name="portfolioUrl" type="url" placeholder="https://" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Upload CV (PDF/DOC, max 5MB)</label>
          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-line bg-surface-2 px-4 py-7 text-sm text-ink-3 transition-colors hover:border-electric hover:text-electric dark:bg-surface">
            <UploadCloud size={20} />
            {cvName ? <span className="font-semibold text-ink">{cvName}</span> : "Click to upload your CV"}
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setCvName(e.target.files?.[0]?.name ?? "")}
            />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Additional Message</label>
          <textarea name="message" rows={4} placeholder="Anything you'd like us to know..." className={`${inputCls} resize-none`} />
        </div>
      </div>

      {state && !state.ok && (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-red-500">
          <AlertCircle size={15} /> {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-electric px-8 py-4 text-sm font-semibold text-white shadow-[0_16px_40px_-12px_var(--glow)] transition-all hover:scale-[1.01] disabled:opacity-60"
      >
        {pending ? "Submitting Application..." : "Submit Application"} <Send size={15} />
      </button>
      <p className="mt-4 text-center text-xs text-ink-3">
        By submitting, you agree that Wizzo Solutions may contact you regarding this application.
      </p>
    </form>
  );
}
