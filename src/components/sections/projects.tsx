"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ShoppingBag,
  Store,
  HeartPulse,
  FolderGit2,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { featuredProjects } from "@/lib/site";

const categoryIconMap: Record<string, LucideIcon> = {
  "Academic Community Platform": GraduationCap,
  "Fashion E-commerce": ShoppingBag,
  "Retail & Service Management": Store,
  "Healthcare & Medication Management": HeartPulse,
};

export function ProjectsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  const scrollByCard = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Real Work. Practical Systems. Measurable Value.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-2">
              A portfolio of platforms, systems, and operational tools engineered with care. Drag, swipe,
              or use the arrows to explore.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Previous project"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:text-electric"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Next project"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:text-electric"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mx-auto mt-12 max-w-7xl px-5 md:px-8">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto pb-6 active:cursor-grabbing"
          style={{ touchAction: "pan-x" }}
        >
          {featuredProjects.map((project, idx) => (
            <article
              data-card
              key={project.id}
              className="glass-card group flex w-[86vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-xl sm:w-[420px] lg:w-[460px]"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={920}
                  height={416}
                  sizes="(min-width: 1024px) 460px, (min-width: 640px) 420px, 86vw"
                  className="h-52 w-full select-none object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  Project {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  {(() => {
                    const CategoryIcon = categoryIconMap[project.category] || FolderGit2;
                    return (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-electric-soft px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-electric">
                        <CategoryIcon size={12} className="shrink-0" />
                        {project.category}
                      </span>
                    );
                  })()}
                  <span className="text-[11px] font-medium text-ink-3">{project.type}</span>
                </div>

                <h3 className="font-display mt-3 text-xl font-bold text-ink transition-colors group-hover:text-electric">
                  {project.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-ink-2">{project.overview}</p>

                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                    Key capabilities
                  </span>
                  <ul className="mt-2 space-y-1.5">
                    {project.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2 text-xs text-ink-2">
                        <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-electric" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto border-t border-line/60 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                    Technology
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-line bg-surface-2/40 px-2 py-0.5 font-mono text-[10px] text-ink-3"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
