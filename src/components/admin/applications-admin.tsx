"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Download, GraduationCap } from "lucide-react";
import { adminSetApplicationStatus, adminDeleteApplication } from "@/lib/actions/admin";
import { Card, Badge, DeleteBtn, Modal, inputCls } from "./ui";
import { cn, formatDate, initials } from "@/lib/utils";

type App = {
  id: number; fullName: string; email: string; phone: string;
  university: string | null; department: string | null; educationLevel: string | null;
  position: string; skills: string | null; portfolioUrl: string | null; cvPath: string | null;
  message: string | null; status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "APPROVED" | "REJECTED";
  createdAt: string;
};

const statuses = ["ALL", "PENDING", "REVIEWED", "SHORTLISTED", "APPROVED", "REJECTED"] as const;
const tone: Record<string, "amber" | "blue" | "navy" | "green" | "red"> = {
  PENDING: "amber", REVIEWED: "blue", SHORTLISTED: "navy", APPROVED: "green", REJECTED: "red",
};

export function ApplicationsAdmin({ applications }: { applications: App[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("ALL");
  const [view, setView] = useState<App | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: applications.length };
    for (const s of statuses.slice(1)) c[s] = applications.filter((a) => a.status === s).length;
    return c;
  }, [applications]);

  const visible = filter === "ALL" ? applications : applications.filter((a) => a.status === filter);

  const setStatus = async (id: number, status: App["status"]) => {
    await adminSetApplicationStatus(id, status);
    router.refresh();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Job Application Management</h1>
      <p className="mt-1.5 text-sm text-ink-2">
        Review, shortlist, approve or reject internship and job applications.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-bold transition-all",
              filter === s ? "border-electric bg-electric text-white" : "border-line bg-surface text-ink-2 hover:border-electric hover:text-electric"
            )}
          >
            {s} <span className="opacity-70">({counts[s] ?? 0})</span>
          </button>
        ))}
      </div>

      <Card className="mt-5 !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-ink-3">
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Position</th>
                <th className="px-5 py-3.5">Education</th>
                <th className="px-5 py-3.5">Applied</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-ink-3">No applications in this view.</td></tr>
              )}
              {visible.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-display flex h-9 w-9 items-center justify-center rounded-xl bg-electric-soft text-xs font-bold text-electric">
                        {initials(a.fullName)}
                      </span>
                      <div>
                        <p className="font-semibold text-ink">{a.fullName}</p>
                        <p className="text-xs text-ink-3">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-ink">{a.position}</td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-ink-2">{a.university ?? "—"}</p>
                    <p className="text-[11px] text-ink-3">{[a.department, a.educationLevel].filter(Boolean).join(" · ")}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-ink-3">{formatDate(a.createdAt)}</td>
                  <td className="px-5 py-4"><Badge tone={tone[a.status]}>{a.status}</Badge></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {a.cvPath && (
                        <a
                          href={`/api/cv/${a.id}`}
                          title="Download CV"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-electric hover:text-electric"
                        >
                          <Download size={13} />
                        </a>
                      )}
                      <button
                        title="View details"
                        onClick={() => setView(a)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-electric hover:text-electric"
                      >
                        <Eye size={13} />
                      </button>
                      <select
                        value={a.status}
                        onChange={(e) => setStatus(a.id, e.target.value as App["status"])}
                        className={cn(inputCls, "w-32 !py-1.5 text-xs")}
                        aria-label="Change status"
                      >
                        {statuses.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <DeleteBtn small onDelete={() => adminDeleteApplication(a.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail modal */}
      <Modal open={!!view} onClose={() => setView(null)} title={view?.fullName ?? ""} wide>
        {view && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Email", view.email], ["Phone", view.phone],
                ["Position", view.position], ["Education", view.educationLevel],
                ["University", view.university], ["Department", view.department],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-line bg-surface-2 p-3 dark:bg-surface-2/40">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-3">{k}</p>
                  <p className="mt-1 font-medium text-ink">{v ?? "—"}</p>
                </div>
              ))}
            </div>
            {view.skills && (
              <div className="rounded-xl border border-line bg-surface-2 p-3 dark:bg-surface-2/40">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-3">Skills</p>
                <p className="mt-1 text-ink">{view.skills}</p>
              </div>
            )}
            {view.portfolioUrl && (
              <a href={view.portfolioUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-line bg-surface-2 p-3 text-electric underline-offset-2 hover:underline dark:bg-surface-2/40">
                Portfolio / LinkedIn ↗
              </a>
            )}
            {view.message && (
              <div className="rounded-xl border border-line bg-surface-2 p-3 dark:bg-surface-2/40">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-3">Message</p>
                <p className="mt-1 whitespace-pre-line text-ink-2">{view.message}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {(["SHORTLISTED", "APPROVED", "REJECTED"] as const).map((s) => (
                <button
                  key={s}
                  onClick={async () => { await setStatus(view.id, s); setView({ ...view, status: s }); }}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-bold transition-transform hover:scale-105",
                    s === "SHORTLISTED" && "bg-navy text-white dark:bg-electric",
                    s === "APPROVED" && "bg-emerald-500 text-white",
                    s === "REJECTED" && "bg-red-500 text-white"
                  )}
                >
                  {s === "SHORTLISTED" ? "Shortlist Candidate" : s === "APPROVED" ? "Approve" : "Reject"}
                </button>
              ))}
              {view.cvPath && (
                <a href={`/api/cv/${view.id}`} className="inline-flex items-center gap-2 rounded-full border border-electric px-4 py-2 text-xs font-bold text-electric hover:bg-electric hover:text-white">
                  <Download size={13} /> Download CV
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
