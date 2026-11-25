"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Megaphone, Award, Users, GraduationCap, KeyRound } from "lucide-react";
import {
  adminCreateUser, adminSetUserStatus, adminSetUserRole, adminDeleteUser,
  adminResetPassword, adminAssignMentor, adminCreateAnnouncement, adminDeleteAnnouncement,
  adminIssueCertificate, adminDeleteCertificate,
} from "@/lib/actions/admin";
import { Card, Badge, AdminButton, DeleteBtn, Modal, Field, inputCls } from "./ui";
import { cn, formatDate, initials } from "@/lib/utils";

type Row = {
  id: number; name: string; email: string; role: "ADMIN" | "EMPLOYEE" | "INTERN";
  phone: string | null; position: string | null; department: string | null;
  university: string | null; program: string | null; mentorId: number | null;
  status: string; createdAt: string;
};

type Props = {
  employees: Row[]; interns: Row[]; admins: Row[];
  team: { id: number; name: string; role: "ADMIN" | "EMPLOYEE" | "INTERN" }[];
  announcements: { id: number; title: string; body: string; audience: string; createdAt: string }[];
  certificates: { id: number; userId: number; userName: string; title: string; program: string | null; credentialId: string | null; issueDate: string }[];
};

const tabs = [
  { id: "employees", label: "Employees", icon: Users },
  { id: "interns", label: "Interns", icon: GraduationCap },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "certificates", label: "Certificates", icon: Award },
] as const;

export function UsersAdmin({ employees, interns, team, announcements, certificates }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("employees");
  const [addOpen, setAddOpen] = useState(false);
  const [annOpen, setAnnOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => router.refresh();

  const staff = team.filter((t) => t.role === "EMPLOYEE" || t.role === "ADMIN");

  const userTable = (rows: Row[], showMentor: boolean) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-ink-3">
            <th className="px-4 py-3">Member</th>
            <th className="px-4 py-3">Role Info</th>
            {showMentor && <th className="px-4 py-3">Mentor</th>}
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-3">No members yet — add one above.</td></tr>
          )}
          {rows.map((u) => (
            <tr key={u.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="font-display flex h-9 w-9 items-center justify-center rounded-xl bg-electric text-xs font-bold text-white">
                    {initials(u.name)}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{u.name}</p>
                    <p className="text-xs text-ink-3">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <p className="text-ink">{u.position ?? "—"}</p>
                <p className="text-xs text-ink-3">{u.university ?? u.department ?? ""}</p>
              </td>
              {showMentor && (
                <td className="px-4 py-3.5">
                  <select
                    className={cn(inputCls, "w-40 !py-1.5 text-xs")}
                    value={u.mentorId ?? ""}
                    onChange={async (e) => {
                      await adminAssignMentor(u.id, e.target.value ? Number(e.target.value) : null);
                      refresh();
                    }}
                  >
                    <option value="">No mentor</option>
                    {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </td>
              )}
              <td className="px-4 py-3.5">
                <button
                  onClick={async () => { await adminSetUserStatus(u.id, u.status === "ACTIVE" ? "DISABLED" : "ACTIVE"); refresh(); }}
                  title="Click to toggle"
                >
                  <Badge tone={u.status === "ACTIVE" ? "green" : "red"}>{u.status}</Badge>
                </button>
              </td>
              <td className="px-4 py-3.5">
                <select
                  className={cn(inputCls, "w-32 !py-1.5 text-xs")}
                  value={u.role}
                  onChange={async (e) => {
                    const r = await adminSetUserRole(u.id, e.target.value as Row["role"]);
                    if (!r.ok) alert(r.error);
                    refresh();
                  }}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="INTERN">Intern</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1.5">
                  <button
                    title="Reset password"
                    onClick={async () => {
                      const pw = prompt(`New password for ${u.name} (min 8 chars):`);
                      if (!pw) return;
                      const r = await adminResetPassword(u.id, pw);
                      if (!r.ok) alert(r.error); else alert("Password updated.");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-electric hover:text-electric"
                  >
                    <KeyRound size={13} />
                  </button>
                  <DeleteBtn small onDelete={() => adminDeleteUser(u.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Team & Intern Management</h1>
          <p className="mt-1.5 text-sm text-ink-2">
            Create accounts, manage roles, assign mentors, publish announcements and issue certificates.
          </p>
        </div>
        <div className="flex gap-2">
          {tab === "announcements" ? (
            <AdminButton onClick={() => setAnnOpen(true)}><Megaphone size={14} /> New Announcement</AdminButton>
          ) : tab === "certificates" ? (
            <AdminButton onClick={() => setCertOpen(true)}><Award size={14} /> Issue Certificate</AdminButton>
          ) : (
            <AdminButton onClick={() => setAddOpen(true)}><UserPlus size={14} /> Add Member</AdminButton>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all",
              tab === t.id ? "border-electric bg-electric text-white" : "border-line bg-surface text-ink-2 hover:border-electric hover:text-electric"
            )}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <Card className="mt-5 !p-0 overflow-hidden">
        {tab === "employees" && userTable(employees, false)}
        {tab === "interns" && userTable(interns, true)}

        {tab === "announcements" && (
          <div className="space-y-3 p-5">
            {announcements.length === 0 && <p className="py-8 text-center text-sm text-ink-3">No announcements yet.</p>}
            {announcements.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-4 rounded-2xl border border-line bg-surface-2 p-4 dark:bg-surface-2/40">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink">{a.title}</p>
                    <Badge tone={a.audience === "ALL" ? "gray" : a.audience === "INTERNS" ? "navy" : "blue"}>{a.audience}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-2">{a.body}</p>
                  <p className="mt-1.5 text-[11px] text-ink-3">{formatDate(a.createdAt)}</p>
                </div>
                <DeleteBtn small onDelete={() => adminDeleteAnnouncement(a.id)} />
              </div>
            ))}
          </div>
        )}

        {tab === "certificates" && (
          <div className="space-y-3 p-5">
            {certificates.length === 0 && <p className="py-8 text-center text-sm text-ink-3">No certificates issued yet.</p>}
            {certificates.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-4 rounded-2xl border border-line bg-surface-2 p-4 dark:bg-surface-2/40">
                <div>
                  <p className="font-semibold text-ink">{c.title}</p>
                  <p className="text-sm text-ink-2">{c.userName} · {c.program ?? "—"}</p>
                  <p className="mt-1 text-[11px] text-ink-3">
                    {formatDate(c.issueDate)} · <span className="font-mono">{c.credentialId}</span>
                  </p>
                </div>
                <DeleteBtn small onDelete={() => adminDeleteCertificate(c.id)} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add member modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Team Member" wide>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const r = await adminCreateUser({
              name: String(fd.get("name")), email: String(fd.get("email")),
              password: String(fd.get("password")), role: String(fd.get("role")) as "EMPLOYEE" | "INTERN",
              phone: String(fd.get("phone")), position: String(fd.get("position")),
              department: String(fd.get("department")), university: String(fd.get("university")),
              program: String(fd.get("program")),
              mentorId: fd.get("mentorId") ? Number(fd.get("mentorId")) : null,
            });
            if (!r.ok) { setError(r.error ?? "Failed"); return; }
            setAddOpen(false); setError(""); refresh();
          }}
        >
          <Field label="Full Name *"><input name="name" required className={inputCls} /></Field>
          <Field label="Email *"><input name="email" type="email" required className={inputCls} /></Field>
          <Field label="Temporary Password * (min 8 chars)"><input name="password" required minLength={8} className={inputCls} /></Field>
          <Field label="Role *">
            <select name="role" className={inputCls} defaultValue={tab === "interns" ? "INTERN" : "EMPLOYEE"}>
              <option value="EMPLOYEE">Employee</option>
              <option value="INTERN">Intern</option>
            </select>
          </Field>
          <Field label="Position"><input name="position" className={inputCls} placeholder="e.g. Software Engineer" /></Field>
          <Field label="Department"><input name="department" className={inputCls} /></Field>
          <Field label="Phone"><input name="phone" className={inputCls} /></Field>
          <Field label="University (interns)"><input name="university" className={inputCls} /></Field>
          <Field label="Program (interns)"><input name="program" className={inputCls} placeholder="Wizzo Internship Program" /></Field>
          <Field label="Mentor (interns)">
            <select name="mentorId" className={inputCls} defaultValue="">
              <option value="">None</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <div className="flex items-center justify-between sm:col-span-2">
            <p className="text-xs font-semibold text-red-500">{error}</p>
            <AdminButton type="submit" className="!px-6 !py-2.5">Create Account</AdminButton>
          </div>
        </form>
      </Modal>

      {/* Announcement modal */}
      <Modal open={annOpen} onClose={() => setAnnOpen(false)} title="New Announcement">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const r = await adminCreateAnnouncement({
              title: String(fd.get("title")), body: String(fd.get("body")),
              audience: String(fd.get("audience")) as "ALL" | "EMPLOYEES" | "INTERNS",
            });
            if (!r.ok) { setError(r.error ?? "Failed"); return; }
            setAnnOpen(false); setError(""); refresh();
          }}
        >
          <Field label="Title *"><input name="title" required className={inputCls} /></Field>
          <Field label="Message *"><textarea name="body" required rows={4} className={cn(inputCls, "resize-none")} /></Field>
          <Field label="Audience">
            <select name="audience" className={inputCls}>
              <option value="ALL">Everyone</option>
              <option value="EMPLOYEES">Employees only</option>
              <option value="INTERNS">Interns only</option>
            </select>
          </Field>
          <AdminButton type="submit" className="w-full !py-3">Publish Announcement</AdminButton>
        </form>
      </Modal>

      {/* Certificate modal */}
      <Modal open={certOpen} onClose={() => setCertOpen(false)} title="Issue Certificate">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const r = await adminIssueCertificate({
              userId: Number(fd.get("userId")), title: String(fd.get("title")), program: String(fd.get("program")),
            });
            if (!r.ok) { setError(r.error ?? "Failed"); return; }
            setCertOpen(false); setError(""); refresh();
          }}
        >
          <Field label="Recipient *">
            <select name="userId" required className={inputCls} defaultValue="">
              <option value="" disabled>Select team member</option>
              {team.filter((t) => t.role !== "ADMIN").map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.role.toLowerCase()})</option>
              ))}
            </select>
          </Field>
          <Field label="Certificate Title *"><input name="title" required className={inputCls} placeholder="e.g. Internship Completion" /></Field>
          <Field label="Program"><input name="program" className={inputCls} placeholder="Wizzo Internship Program" /></Field>
          <AdminButton type="submit" className="w-full !py-3">Issue Certificate</AdminButton>
        </form>
      </Modal>
    </div>
  );
}
