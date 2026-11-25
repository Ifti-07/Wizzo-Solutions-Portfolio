"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, CalendarDays, ChevronDown, ArrowUpRight, GraduationCap, Briefcase, Inbox,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { cn, formatDate } from "@/lib/utils";

export type JobItem = {
  id: number;
  title: string;
  type: "INTERNSHIP" | "FULL_TIME";
  category: string;
  location: string;
  description: string;
  requirements: string;
  deadline: string | null;
};

export function JobsList({ jobs }: { jobs: JobItem[] }) {
  const [openId, setOpenId] = useState<number | null>(jobs[0]?.id ?? null);

  if (jobs.length === 0) {
    return (
      <Reveal className="mt-12">
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-surface p-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-soft text-electric">
            <Inbox size={24} />
          </span>
          <h3 className="font-display mt-5 text-xl font-bold text-ink">No open positions right now</h3>
          <p className="mt-2 max-w-sm text-sm text-ink-2">
            New internship and full-time opportunities are posted regularly. Check back soon or send
            us your CV through the contact form.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="mt-12 space-y-4">
      {jobs.map((job, i) => {
        const open = openId === job.id;
        const Icon = job.type === "INTERNSHIP" ? GraduationCap : Briefcase;
        return (
          <Reveal key={job.id} delay={i * 0.06}>
            <div
              className={cn(
                "overflow-hidden rounded-3xl border bg-surface transition-colors duration-300",
                open ? "border-electric/40 shadow-[0_20px_50px_-24px_var(--glow)]" : "border-line"
              )}
            >
              <button
                onClick={() => setOpenId(open ? null : job.id)}
                className="flex w-full items-center gap-4 p-5 text-left md:p-6"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
                    job.type === "INTERNSHIP" ? "bg-electric text-white" : "bg-electric-soft text-electric"
                  )}
                >
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block truncate text-lg font-bold text-ink">{job.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-3">
                    <span className="rounded-full bg-electric-soft px-2.5 py-0.5 font-semibold text-electric">
                      {job.type === "INTERNSHIP" ? "Internship" : "Full-Time"}
                    </span>
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                    {job.deadline && (
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={12} /> Apply by {formatDate(job.deadline)}
                      </span>
                    )}
                  </span>
                </span>
                <ChevronDown
                  size={18}
                  className={cn("shrink-0 text-ink-3 transition-transform duration-300", open && "rotate-180 text-electric")}
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="border-t border-line px-5 pb-6 pt-5 md:px-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-electric">About the Role</h4>
                          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-2">{job.description}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-electric">Requirements</h4>
                          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-2">{job.requirements}</p>
                        </div>
                      </div>
                      <Link
                        href={`/careers/apply/${job.id}`}
                        className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_var(--glow)] transition-transform hover:scale-[1.03]"
                      >
                        Apply Now <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
