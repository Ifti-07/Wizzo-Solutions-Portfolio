"use client";

import { useState, type ReactNode, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/lib/actions/public";

export const inputCls =
  "w-full rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 outline-none transition-all focus:border-electric focus:ring-4 focus:ring-electric/15 dark:bg-surface";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-line bg-surface p-6", className)}>{children}</div>
  );
}

const tones: Record<string, string> = {
  blue: "bg-electric-soft text-electric",
  green: "bg-emerald-500/10 text-emerald-500",
  red: "bg-red-500/10 text-red-500",
  amber: "bg-amber-500/10 text-amber-500",
  gray: "bg-mist text-ink-2 dark:bg-surface-2",
  navy: "bg-navy text-white dark:bg-electric",
};
export function Badge({ tone = "gray", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold", tones[tone])}>
      {children}
    </span>
  );
}

export function AdminButton({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "ghost" | "danger" }) {
  const styles = {
    primary: "bg-electric text-white hover:scale-[1.03] shadow-[0_10px_25px_-10px_var(--glow)]",
    ghost: "border border-line bg-surface text-ink-2 hover:border-electric hover:text-electric",
    danger: "border border-red-500/30 text-red-500 hover:bg-red-500/10",
  } as const;
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all disabled:opacity-60",
        styles[variant],
        className
      )}
    />
  );
}

export function DeleteBtn({ onDelete, small }: { onDelete: () => Promise<unknown>; small?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      aria-label="Delete"
      disabled={busy}
      onClick={async () => {
        if (!confirm("Delete this item? This cannot be undone.")) return;
        setBusy(true);
        await onDelete();
        router.refresh();
        setBusy(false);
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-red-500/25 text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50",
        small ? "px-2.5 py-1.5" : "px-3.5 py-2 text-xs font-bold"
      )}
    >
      <Trash2 size={small ? 13 : 14} /> {!small && "Delete"}
    </button>
  );
}

export function Modal({
  open, onClose, title, children, wide,
}: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-abyss/60 p-4 backdrop-blur-sm md:p-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn("w-full rounded-3xl border border-line bg-surface p-6 shadow-2xl md:p-8", wide ? "max-w-3xl" : "max-w-lg")}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
              <button
                aria-label="Close"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-2 hover:border-electric hover:text-electric"
              >
                <X size={15} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink-2">{label}</label>
      {children}
    </div>
  );
}

export function ActionMessage({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <p className={cn("text-xs font-semibold", result.ok ? "text-emerald-500" : "text-red-500")}>
      {result.ok ? "Saved successfully." : result.error}
    </p>
  );
}
