"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Layout, Layers, Workflow, Database, CreditCard, Shield } from "lucide-react";
import { solutionsList, type SolutionItem } from "@/lib/site";
import { cn } from "@/lib/utils";

const iconMap = {
  Layout,
  Layers,
  Workflow,
  Database,
  CreditCard,
  Shield,
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

interface CardProps {
  item: SolutionItem;
  index: number;
  hovered: number | null;
  onHover: (index: number | null) => void;
}

function SolutionCard({ item, index, hovered, onHover }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();

  const step = (index % 3) * 0.12;
  const isDimmed = hovered !== null && hovered !== index;

  const reveal = (delay: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : "translateY(14px)",
    transition: reduce
      ? "none"
      : `opacity 0.7s ${EASE} ${delay}s, transform 0.7s ${EASE} ${delay}s`,
  });

  const Icon = iconMap[item.iconName as keyof typeof iconMap] || Layout;
  const sol = `SOL-${String(index + 1).padStart(2, "0")}`;

  return (
    <div
      ref={ref}
      onMouseEnter={() => onHover(index)}
      className={cn(
        "relative h-full transition-all duration-500",
        isDimmed ? "scale-[0.99] opacity-50 blur-[2px]" : ""
      )}
    >
      <motion.div
        initial={false}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card group relative flex h-full flex-col justify-between rounded-3xl p-7 transition-[box-shadow] duration-300 hover:shadow-lg"
      >
        {/* Skeleton shown first, then fades away as the real content reveals */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-surface p-7"
          style={{
            opacity: inView ? 0 : 1,
            transition: reduce ? "none" : `opacity 0.4s ease ${step + 0.55}s`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-surface-2" />
            <div className="h-3 w-12 animate-pulse rounded bg-surface-2" />
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-5 w-4/5 animate-pulse rounded bg-surface-2" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-surface-2" />
          </div>
          <div className="mt-4 h-24 animate-pulse rounded-xl bg-surface-2/80" />
          <div className="mt-3 h-20 animate-pulse rounded-xl bg-surface-2/70" />
          <div className="mt-6 flex gap-1.5">
            <div className="h-4 w-12 animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-16 animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-10 animate-pulse rounded bg-surface-2" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between" style={reveal(step + 0.75)}>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric-soft text-electric transition-colors group-hover:bg-electric group-hover:text-white">
              <Icon size={20} />
            </span>
            <span
              className={cn(
                "font-mono text-[11px] transition-colors duration-300",
                hovered === index ? "text-electric" : "text-ink-3"
              )}
            >
              {sol}
            </span>
          </div>

          <h3 className="font-display mt-5 text-xl font-bold text-ink" style={reveal(step + 0.9)}>
            {item.title}
          </h3>

          <div
            className="mt-4 rounded-xl border border-red-500/15 bg-red-500/[0.04] p-3 text-xs"
            style={reveal(step + 1.6)}
          >
            <span className="mb-1 block font-semibold text-red-600 dark:text-red-400">
              The Challenge:
            </span>
            <p className="leading-relaxed text-ink-2">{item.problem}</p>
          </div>

          <div
            className="mt-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-3 text-xs"
            style={reveal(step + 3.3)}
          >
            <span className="mb-1 block font-semibold text-emerald-600 dark:text-emerald-400">
              The Practical Outcome:
            </span>
            <p className="font-medium leading-relaxed text-ink-2">{item.businessOutcome}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-line/60 pt-4" style={reveal(step + 3.5)}>
          <div className="flex flex-wrap gap-1.5">
            {item.typicalTech.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-ink-3"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function SolutionsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="solutions"
      className="relative py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Business Solutions Designed to Solve Real-World Friction
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-2 sm:text-base">
            Services explain what we do; solutions explain what you gain. We turn complex technical capabilities
            into tangible business outcomes that save time, cut errors, and generate revenue.
          </p>
        </div>

        {/* 6 Solutions Cards (Problem & Outcome Mapping) */}
        <div
          className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          onMouseLeave={() => setHovered(null)}
        >
          {solutionsList.map((item, index) => (
            <SolutionCard
              key={item.id}
              item={item}
              index={index}
              hovered={hovered}
              onHover={setHovered}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
