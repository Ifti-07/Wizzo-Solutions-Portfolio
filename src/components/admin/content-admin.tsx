"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Layers3, FolderKanban, Handshake } from "lucide-react";
import {
  adminSaveService, adminDeleteService, adminSaveProject, adminDeleteProject,
  adminSavePartner, adminDeletePartner,
} from "@/lib/actions/admin";
import { Card, Badge, AdminButton, DeleteBtn, Modal, Field, inputCls } from "./ui";
import { cn } from "@/lib/utils";

type Service = { id: number; title: string; description: string; details: string; icon: string; order: number; active: boolean };
type Project = { id: number; title: string; category: string; description: string; techStack: string; liveUrl: string | null; gradient: string; order: number };
type Partner = { id: number; name: string; glyph: string; websiteUrl: string | null; order: number; active: boolean };

const iconOptions = [
  "Code2", "Globe", "AppWindow", "Workflow", "Webhook", "Compass",
  "Lightbulb", "ShieldCheck", "Layers", "Database", "Boxes", "Handshake",
  "Briefcase", "ShoppingBag",
];

const tabs = [
  { id: "services", label: "Services", icon: Layers3 },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "partners", label: "Partners", icon: Handshake },
] as const;

export function ContentAdmin({ services, projects, partners }: { services: Service[]; projects: Project[]; partners: Partner[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("services");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const refresh = () => router.refresh();
  const close = () => { setEditingService(null); setEditingProject(null); setEditingPartner(null); setCreating(false); setError(""); };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Website Content Management</h1>
          <p className="mt-1.5 text-sm text-ink-2">
            Edit the services, portfolio projects and partner logos shown on the public website — no code changes needed.
          </p>
        </div>
        <AdminButton onClick={() => setCreating(true)}><Plus size={14} /> Add {tab.slice(0, -1)}</AdminButton>
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
            <span className="opacity-70">
              ({tab === "services" ? services.length : tab === "projects" ? projects.length : partners.length})
            </span>
          </button>
        ))}
      </div>

      {tab === "services" && (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display font-bold text-ink">{s.title}</p>
                  {!s.active && <Badge tone="red">Hidden</Badge>}
                </div>
                <span className="rounded-md bg-mist px-2 py-1 font-mono text-[10px] text-ink-3 dark:bg-surface-2">{s.icon}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink-2">{s.description}</p>
              <div className="mt-4 flex justify-end gap-1.5">
                <AdminButton variant="ghost" onClick={() => setEditingService(s)}><Pencil size={13} /> Edit</AdminButton>
                <DeleteBtn onDelete={() => adminDeleteService(s.id)} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "projects" && (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.id} className="!p-0 overflow-hidden">
              <div className={cn("flex h-20 items-center justify-center bg-gradient-to-br", p.gradient)}>
                <span className="font-display text-3xl font-bold text-white/40">{p.title.charAt(0)}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display font-bold text-ink">{p.title}</p>
                  <Badge tone="blue">{p.category}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-ink-2">{p.description}</p>
                <p className="mt-2 text-[11px] text-ink-3">{p.techStack}</p>
                <div className="mt-4 flex justify-end gap-1.5">
                  <AdminButton variant="ghost" onClick={() => setEditingProject(p)}><Pencil size={13} /> Edit</AdminButton>
                  <DeleteBtn onDelete={() => adminDeleteProject(p.id)} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "partners" && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {partners.map((p) => (
            <Card key={p.id}>
              <div className="flex items-center gap-3">
                <span className="font-display flex h-11 w-11 items-center justify-center rounded-xl bg-electric-soft text-sm font-bold text-electric">
                  {p.glyph}
                </span>
                <div>
                  <p className="font-display font-bold text-ink">{p.name}</p>
                  {!p.active && <Badge tone="red">Hidden</Badge>}
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-1.5">
                <AdminButton variant="ghost" onClick={() => setEditingPartner(p)}><Pencil size={13} /> Edit</AdminButton>
                <DeleteBtn onDelete={() => adminDeletePartner(p.id)} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Service modal */}
      <Modal open={creating && tab === "services" || !!editingService} onClose={close} title={editingService ? "Edit Service" : "New Service"} wide>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const r = await adminSaveService({
              id: editingService?.id,
              title: String(fd.get("title")), description: String(fd.get("description")),
              details: String(fd.get("details")), icon: String(fd.get("icon")),
              order: Number(fd.get("order") || 0), active: fd.get("active") !== null,
            });
            if (!r.ok) { setError(r.error ?? "Failed"); return; }
            close(); refresh();
          }}
        >
          <Field label="Title *"><input name="title" required className={inputCls} defaultValue={editingService?.title} /></Field>
          <Field label="Icon">
            <select name="icon" className={inputCls} defaultValue={editingService?.icon ?? "Code2"}>
              {iconOptions.map((i) => <option key={i}>{i}</option>)}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Short Description *">
              <input name="description" required className={inputCls} defaultValue={editingService?.description} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Details (Learn More)">
              <textarea name="details" rows={3} className={cn(inputCls, "resize-none")} defaultValue={editingService?.details} />
            </Field>
          </div>
          <Field label="Order"><input name="order" type="number" className={inputCls} defaultValue={editingService?.order ?? services.length} /></Field>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" name="active" defaultChecked={editingService?.active ?? true} className="h-4 w-4 accent-electric" /> Visible
            </label>
          </div>
          <div className="flex items-center justify-between sm:col-span-2">
            <p className="text-xs font-semibold text-red-500">{error}</p>
            <AdminButton type="submit" className="!px-6 !py-2.5">Save Service</AdminButton>
          </div>
        </form>
      </Modal>

      {/* Project modal */}
      <Modal open={creating && tab === "projects" || !!editingProject} onClose={close} title={editingProject ? "Edit Project" : "New Project"} wide>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const r = await adminSaveProject({
              id: editingProject?.id,
              title: String(fd.get("title")), category: String(fd.get("category")),
              description: String(fd.get("description")), techStack: String(fd.get("techStack")),
              liveUrl: String(fd.get("liveUrl")), order: Number(fd.get("order") || 0),
            });
            if (!r.ok) { setError(r.error ?? "Failed"); return; }
            close(); refresh();
          }}
        >
          <Field label="Title *"><input name="title" required className={inputCls} defaultValue={editingProject?.title} /></Field>
          <Field label="Category"><input name="category" className={inputCls} defaultValue={editingProject?.category ?? "Web"} placeholder="Web / Mobile / E-commerce / Software" /></Field>
          <div className="sm:col-span-2">
            <Field label="Description *"><textarea name="description" required rows={3} className={cn(inputCls, "resize-none")} defaultValue={editingProject?.description} /></Field>
          </div>
          <Field label="Tech Stack (comma separated)"><input name="techStack" className={inputCls} defaultValue={editingProject?.techStack} placeholder="Next.js, PostgreSQL" /></Field>
          <Field label="Live URL"><input name="liveUrl" className={inputCls} defaultValue={editingProject?.liveUrl ?? ""} placeholder="https://" /></Field>
          <Field label="Order"><input name="order" type="number" className={inputCls} defaultValue={editingProject?.order ?? projects.length} /></Field>
          <div className="flex items-center justify-between sm:col-span-2">
            <p className="text-xs font-semibold text-red-500">{error}</p>
            <AdminButton type="submit" className="!px-6 !py-2.5">Save Project</AdminButton>
          </div>
        </form>
      </Modal>

      {/* Partner modal */}
      <Modal open={creating && tab === "partners" || !!editingPartner} onClose={close} title={editingPartner ? "Edit Partner" : "New Partner"}>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const r = await adminSavePartner({
              id: editingPartner?.id,
              name: String(fd.get("name")), glyph: String(fd.get("glyph")) || undefined,
              websiteUrl: String(fd.get("websiteUrl")), order: Number(fd.get("order") || 0),
              active: fd.get("active") !== null,
            });
            if (!r.ok) { setError(r.error ?? "Failed"); return; }
            close(); refresh();
          }}
        >
          <Field label="Partner Name *"><input name="name" required className={inputCls} defaultValue={editingPartner?.name} /></Field>
          <Field label="Logo Letters (monogram)"><input name="glyph" maxLength={3} className={inputCls} defaultValue={editingPartner?.glyph} placeholder="e.g. NT" /></Field>
          <Field label="Website URL"><input name="websiteUrl" className={inputCls} defaultValue={editingPartner?.websiteUrl ?? ""} /></Field>
          <Field label="Order"><input name="order" type="number" className={inputCls} defaultValue={editingPartner?.order ?? partners.length} /></Field>
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input type="checkbox" name="active" defaultChecked={editingPartner?.active ?? true} className="h-4 w-4 accent-electric" /> Visible in carousel
          </label>
          <AdminButton type="submit" className="w-full !py-3">Save Partner</AdminButton>
        </form>
      </Modal>
    </div>
  );
}
