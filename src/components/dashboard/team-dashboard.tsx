"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut, Bell, ClipboardList, Award, GraduationCap, BadgeCheck, Clock3,
  KeyRound, CheckCircle2, AlertCircle, CircleDot, ArrowRight, Home,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme";
import { logout, changePassword } from "@/lib/actions/auth";
import { updateTaskStatus } from "@/lib/actions/dashboard";
import { cn, formatDate, initials } from "@/lib/utils";

type Props = {
  user: {
    id: number; name: string; email: string; role: "EMPLOYEE" | "INTERN" | "ADMIN";
    phone: string | null; position: string | null; department: string | null;
    university: string | null; program: string | null; createdAt: string;
  };
  mentor: { name: string; position: string | null } | null;
  tasks: { id: number; title: string; description: string; status: "TODO" | "IN_PROGRESS" | "DONE"; dueDate: string | null }[];
  announcements: { id: number; title: string; body: string; createdAt: string }[];
  certificates: { id: number; title: string; program: string | null; credentialId: string | null; issueDate: string }[];
};

const statusMeta = {
  TODO: { label: "To Do", cls: "bg-mist text-ink-2 dark:bg-surface-2", next: "IN_PROGRESS" as const, nextLabel: "Start" },
  IN_PROGRESS: { label: "In Progress", cls: "bg-electric-soft text-electric", next: "DONE" as const, nextLabel: "Complete" },
  DONE: { label: "Done", cls: "bg-emerald-500/10 text-emerald-500", next: "TODO" as const, nextLabel: "Reopen" },
};

const inputCls =
  "w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-3 outline-none transition-all focus:border-electric focus:ring-4 focus:ring-electric/15 dark:bg-surface";

export function TeamDashboard({ user, mentor, tasks, announcements, certificates }: Props) {
  const router = useRouter();
  const [pwState, pwAction, pwPending] = useActionState(changePassword, null);
  const [pwDone, setPwDone] = useState(false);

  const done = tasks.filter((t) => t.status === "DONE").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const isIntern = user.role === "INTERN";

  const advanceTask = async (id: number, status: "TODO" | "IN_PROGRESS" | "DONE") => {
    await updateTaskStatus(id, status);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <header className="glass sticky top-0 z-50 border-b border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
          <Logo />
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink-2 transition-colors hover:border-electric hover:text-electric sm:inline-flex"
            >
              <Home size={13} /> Website
            </Link>
            <ThemeToggle />
            <button
              onClick={async () => { await logout(); window.location.href = "/login"; }}
              className="inline-flex items-center gap-1.5 rounded-full bg-electric px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.04]"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]",
            isIntern ? "bg-electric text-white" : "bg-navy text-white dark:bg-electric"
          )}>
            {isIntern ? <GraduationCap size={13} /> : <BadgeCheck size={13} />}
            {isIntern ? "Intern Dashboard" : "Employee Dashboard"}
          </span>
          <h1 className="font-display mt-4 text-3xl font-bold text-ink sm:text-4xl">
            Welcome back, <span className="text-gradient">{user.name.split(" ")[0]}</span>
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            {isIntern
              ? "Track your internship progress, tasks and announcements."
              : "Here's an overview of your work, tasks and announcements."}
          </p>
        </motion.div>

        <div className="mt-9 grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <motion.section
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="rounded-3xl border border-line bg-surface p-7"
          >
            <div className="flex items-center gap-4">
              <span className="font-display flex h-16 w-16 items-center justify-center rounded-2xl bg-electric text-xl font-bold text-white shadow-[0_14px_30px_-10px_var(--glow)]">
                {initials(user.name)}
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-ink">{user.name}</h2>
                <p className="text-sm text-ink-3">{user.position ?? "Team Member"}</p>
              </div>
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Email", user.email],
                ["Department", user.department],
                ["Phone", user.phone],
                ...(isIntern ? [["University", user.university], ["Program", user.program]] : []),
                ["Member Since", formatDate(user.createdAt)],
              ].map(([k, v]) => (
                <div key={k as string} className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
                  <dt className="text-ink-3">{k}</dt>
                  <dd className="text-right font-medium text-ink">{v || "—"}</dd>
                </div>
              ))}
            </dl>

            {isIntern && (
              <div className="mt-6 rounded-2xl bg-electric-soft p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-electric">Assigned Mentor</p>
                <p className="mt-2 font-semibold text-ink">{mentor?.name ?? "To be assigned"}</p>
                {mentor?.position && <p className="text-xs text-ink-3">{mentor.position}</p>}
              </div>
            )}

            {isIntern && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-ink-3">Learning Progress</span>
                  <span className="text-electric">{progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist dark:bg-surface-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-electric to-[#5c9dff]"
                  />
                </div>
                <p className="mt-2 text-[11px] text-ink-3">
                  Internship status: {progress === 100 ? "Completed — certificate processing" : "Active"}
                </p>
              </div>
            )}
          </motion.section>

          {/* Tasks */}
          <motion.section
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.6 }}
            className="rounded-3xl border border-line bg-surface p-7 lg:col-span-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
                <ClipboardList size={18} className="text-electric" />
                {isIntern ? "Assigned Tasks" : "My Tasks"}
              </h2>
              <span className="rounded-full bg-electric-soft px-3 py-1 text-xs font-bold text-electric">
                {done}/{tasks.length} done
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {tasks.length === 0 && (
                <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-3">
                  No tasks assigned yet. Check back soon!
                </p>
              )}
              {tasks.map((t) => {
                const meta = statusMeta[t.status];
                return (
                  <div
                    key={t.id}
                    className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface-2 p-4 transition-colors hover:border-electric/40 dark:bg-surface-2/40 sm:flex-row sm:items-center"
                  >
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", meta.cls)}>
                      {t.status === "DONE" ? <CheckCircle2 size={16} /> : t.status === "IN_PROGRESS" ? <CircleDot size={16} /> : <Clock3 size={16} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("font-semibold text-ink", t.status === "DONE" && "line-through opacity-60")}>{t.title}</p>
                      {t.description && <p className="mt-0.5 truncate text-xs text-ink-3">{t.description}</p>}
                      {t.dueDate && <p className="mt-1 text-[11px] font-medium text-ink-3">Due {formatDate(t.dueDate)}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold", meta.cls)}>{meta.label}</span>
                      <button
                        onClick={() => advanceTask(t.id, meta.next)}
                        className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-bold text-ink-2 transition-colors hover:border-electric hover:text-electric"
                      >
                        {meta.nextLabel} <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Announcements */}
          <motion.section
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.6 }}
            className="rounded-3xl border border-line bg-surface p-7 lg:col-span-2"
          >
            <h2 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
              <Bell size={18} className="text-electric" /> Announcements
            </h2>
            <div className="mt-5 space-y-3">
              {announcements.length === 0 && (
                <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-3">No announcements yet.</p>
              )}
              {announcements.map((a) => (
                <div key={a.id} className="rounded-2xl border border-line bg-surface-2 p-5 dark:bg-surface-2/40">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-ink">{a.title}</h3>
                    <span className="shrink-0 text-[11px] font-medium text-ink-3">{formatDate(a.createdAt)}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{a.body}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Certificates + Security */}
          <motion.section
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-line bg-surface p-7">
              <h2 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
                <Award size={18} className="text-electric" /> Certificates
              </h2>
              <div className="mt-4 space-y-3">
                {certificates.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-line p-6 text-center text-xs text-ink-3">
                    Certificates appear here once issued.
                  </p>
                )}
                {certificates.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-electric/25 bg-electric-soft p-4">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-electric" />
                      <p className="font-semibold text-ink">{c.title}</p>
                    </div>
                    <p className="mt-1 text-xs text-ink-3">{c.program ?? "Wizzo Solutions"}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-ink-3">
                      <span>{formatDate(c.issueDate)}</span>
                      <span className="font-mono">{c.credentialId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-surface p-7">
              <h2 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
                <KeyRound size={18} className="text-electric" /> Security
              </h2>
              <form action={pwAction} className="mt-4 space-y-3">
                <input name="current" type="password" required placeholder="Current password" className={inputCls} />
                <input name="next" type="password" required minLength={8} placeholder="New password (min 8 chars)" className={inputCls} />
                {pwState && !pwState.ok && (
                  <p className="flex items-center gap-2 text-xs font-medium text-red-500"><AlertCircle size={13} /> {pwState.error}</p>
                )}
                {pwState?.ok && (
                  <p className="flex items-center gap-2 text-xs font-medium text-emerald-500"><CheckCircle2 size={13} /> Password updated.</p>
                )}
                <button
                  type="submit"
                  disabled={pwPending}
                  className="w-full rounded-full border border-electric py-2.5 text-xs font-bold text-electric transition-colors hover:bg-electric hover:text-white disabled:opacity-60"
                >
                  {pwPending ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
