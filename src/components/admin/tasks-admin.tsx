"use client";

import { useState } from "react";
import { Plus, CheckCircle2, CircleDot, Clock3 } from "lucide-react";
import { adminAssignTask, adminDeleteTask } from "@/lib/actions/admin";
import { Card, Badge, AdminButton, DeleteBtn, Modal, Field, inputCls } from "./ui";
import { cn, formatDate, initials } from "@/lib/utils";

type TaskRow = {
  id: number; title: string; description: string; status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string | null; assigneeId: number; assigneeName: string;
};

export function TasksAdmin({
  tasks,
  team,
}: {
  tasks: TaskRow[];
  team: { id: number; name: string; role: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const statusBadge = (s: TaskRow["status"]) =>
    s === "DONE" ? <Badge tone="green">Done</Badge> : s === "IN_PROGRESS" ? <Badge tone="blue">In Progress</Badge> : <Badge tone="gray">To Do</Badge>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Task Assignment</h1>
          <p className="mt-1.5 text-sm text-ink-2">Assign and track work for employees and interns.</p>
        </div>
        <AdminButton onClick={() => setOpen(true)}><Plus size={14} /> Assign Task</AdminButton>
      </div>

      <div className="mt-7 space-y-3">
        {tasks.length === 0 && (
          <Card className="py-12 text-center text-sm text-ink-3">No tasks assigned yet.</Card>
        )}
        {tasks.map((t) => (
          <Card key={t.id} className="flex flex-col gap-3 !p-5 sm:flex-row sm:items-center">
            <span className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              t.status === "DONE" ? "bg-emerald-500/10 text-emerald-500" : t.status === "IN_PROGRESS" ? "bg-electric-soft text-electric" : "bg-mist text-ink-3 dark:bg-surface-2"
            )}>
              {t.status === "DONE" ? <CheckCircle2 size={17} /> : t.status === "IN_PROGRESS" ? <CircleDot size={17} /> : <Clock3 size={17} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{t.title}</p>
              <p className="mt-0.5 truncate text-xs text-ink-3">{t.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-2">
                <span className="font-display flex h-6 w-6 items-center justify-center rounded-lg bg-electric text-[10px] font-bold text-white">
                  {initials(t.assigneeName)}
                </span>
                {t.assigneeName}
              </span>
              {t.dueDate && <span className="text-[11px] text-ink-3">Due {formatDate(t.dueDate)}</span>}
              {statusBadge(t.status)}
              <DeleteBtn small onDelete={() => adminDeleteTask(t.id)} />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Assign New Task">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const r = await adminAssignTask({
              title: String(fd.get("title")),
              description: String(fd.get("description")),
              assigneeId: Number(fd.get("assigneeId")),
              dueDate: String(fd.get("dueDate") || "") || undefined,
            });
            if (!r.ok) { setError(r.error ?? "Failed"); return; }
            setOpen(false); setError("");
          }}
        >
          <Field label="Task Title *"><input name="title" required className={inputCls} /></Field>
          <Field label="Description"><textarea name="description" rows={3} className={cn(inputCls, "resize-none")} /></Field>
          <Field label="Assign To *">
            <select name="assigneeId" required className={inputCls} defaultValue="">
              <option value="" disabled>Select team member</option>
              {team.filter((t) => t.role !== "ADMIN").map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.role.toLowerCase()})</option>
              ))}
            </select>
          </Field>
          <Field label="Due Date"><input name="dueDate" type="date" className={inputCls} /></Field>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-red-500">{error}</p>
            <AdminButton type="submit" className="!px-6 !py-2.5">Assign Task</AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
