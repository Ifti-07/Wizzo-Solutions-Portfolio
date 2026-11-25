"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, GraduationCap, Briefcase, MapPin, CalendarDays } from "lucide-react";
import { adminSaveJob, adminToggleJob, adminDeleteJob } from "@/lib/actions/admin";
import { Card, Badge, AdminButton, DeleteBtn, Modal, Field, inputCls } from "./ui";
import { cn, formatDate } from "@/lib/utils";

type Job = {
  id: number; title: string; type: "INTERNSHIP" | "FULL_TIME"; category: string;
  location: string; description: string; requirements: string;
  deadline: string | null; open: boolean; createdAt: string;
};

const empty: Omit<Job, "id" | "createdAt"> = {
  title: "", type: "INTERNSHIP", category: "Engineering", location: "Dhaka, Bangladesh",
  description: "", requirements: "", deadline: "", open: true,
};

interface JobFormProps {
  initial: typeof empty | (Omit<Job, "createdAt"> & { deadline: string });
  id?: number;
  error: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

function JobForm({ initial, id, error, onSuccess, onError }: JobFormProps) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const r = await adminSaveJob({
          id,
          title: String(fd.get("title")),
          type: String(fd.get("type")) as Job["type"],
          category: String(fd.get("category")),
          location: String(fd.get("location")),
          description: String(fd.get("description")),
          requirements: String(fd.get("requirements")),
          deadline: String(fd.get("deadline") || "") || undefined,
          open: fd.get("open") !== null,
        });
        if (!r.ok) {
          onError(r.error ?? "Failed");
          return;
        }
        onSuccess();
      }}
    >
      <Field label="Job Title *"><input name="title" required className={inputCls} defaultValue={initial.title} /></Field>
      <Field label="Type">
        <select name="type" className={inputCls} defaultValue={initial.type}>
          <option value="INTERNSHIP">Internship</option>
          <option value="FULL_TIME">Full-Time</option>
        </select>
      </Field>
      <Field label="Category"><input name="category" className={inputCls} defaultValue={initial.category} /></Field>
      <Field label="Location"><input name="location" className={inputCls} defaultValue={initial.location} /></Field>
      <Field label="Application Deadline">
        <input name="deadline" type="date" className={inputCls} defaultValue={initial.deadline ? initial.deadline.slice(0, 10) : ""} />
      </Field>
      <div className="flex items-end pb-1">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="open" defaultChecked={initial.open} className="h-4 w-4 accent-electric" />
          Accepting applications
        </label>
      </div>
      <div className="sm:col-span-2">
        <Field label="Description *">
          <textarea name="description" required rows={4} className={cn(inputCls, "resize-none")} defaultValue={initial.description} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Requirements (one per line)">
          <textarea name="requirements" rows={4} className={cn(inputCls, "resize-none")} defaultValue={initial.requirements} />
        </Field>
      </div>
      <div className="flex items-center justify-between sm:col-span-2">
        <p className="text-xs font-semibold text-red-500">{error}</p>
        <AdminButton type="submit" className="!px-6 !py-2.5">{id ? "Save Changes" : "Publish Opening"}</AdminButton>
      </div>
    </form>
  );
}

export function JobsAdmin({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [edit, setEdit] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const refresh = () => router.refresh();
  const handleSuccess = () => {
    setCreating(false);
    setEdit(null);
    setError("");
    refresh();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Job Openings</h1>
          <p className="mt-1.5 text-sm text-ink-2">Manage internship and full-time positions shown on the Careers page.</p>
        </div>
        <AdminButton onClick={() => setCreating(true)}><Plus size={14} /> New Opening</AdminButton>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {jobs.length === 0 && (
          <Card className="lg:col-span-2 py-12 text-center text-sm text-ink-3">
            No openings yet — publish your first internship or job.
          </Card>
        )}
        {jobs.map((job) => (
          <Card key={job.id} className="glow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <span className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                  job.type === "INTERNSHIP" ? "bg-electric text-white" : "bg-electric-soft text-electric"
                )}>
                  {job.type === "INTERNSHIP" ? <GraduationCap size={19} /> : <Briefcase size={19} />}
                </span>
                <div>
                  <h3 className="font-display font-bold text-ink">{job.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-ink-3">
                    <Badge tone={job.type === "INTERNSHIP" ? "blue" : "navy"}>
                      {job.type === "INTERNSHIP" ? "Internship" : "Full-Time"}
                    </Badge>
                    <Badge tone={job.open ? "green" : "red"}>{job.open ? "OPEN" : "CLOSED"}</Badge>
                    <span className="inline-flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                    {job.deadline && (
                      <span className="inline-flex items-center gap-1"><CalendarDays size={11} /> {formatDate(job.deadline)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 line-clamp-2 text-sm text-ink-2">{job.description}</p>
            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                onClick={async () => { await adminToggleJob(job.id, !job.open); refresh(); }}
                className="text-xs font-bold text-electric hover:underline"
              >
                {job.open ? "Close Applications" : "Reopen Applications"}
              </button>
              <div className="flex gap-1.5">
                <AdminButton variant="ghost" onClick={() => setEdit({ ...job, deadline: job.deadline ? job.deadline.slice(0, 10) : null })}>
                  <Pencil size={13} /> Edit
                </AdminButton>
                <DeleteBtn onDelete={() => adminDeleteJob(job.id)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="New Opening" wide>
        <JobForm initial={empty} error={error} onSuccess={handleSuccess} onError={setError} />
      </Modal>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={`Edit — ${edit?.title}`} wide>
        {edit && (
          <JobForm
            initial={{ ...edit, deadline: edit.deadline ?? "" }}
            id={edit.id}
            error={error}
            onSuccess={handleSuccess}
            onError={setError}
          />
        )}
      </Modal>
    </div>
  );
}
