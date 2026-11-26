"use client";

import { developmentProcess } from "@/lib/site";
import {
  Search,
  FileText,
  Palette,
  Code2,
  CheckCheck,
  Rocket,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

const stageIconMap: Record<string, LucideIcon> = {
  Search,
  FileText,
  Palette,
  Code2,
  CheckCheck,
  Rocket,
};

export function ProcessSection() {
  return (
    <section id="process" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="heading-3 sm:heading-2 font-semibold tracking-tight text-ink [text-wrap:balance]">
            A structured, six stage development workflow
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-2 sm:text-base">
            From initial requirements gathering to final production deployment and ongoing support,
            our transparent process ensures quality, predictable delivery, and zero unpleasant surprises.
          </p>
        </div>

        {/* 6 Stages Timeline / Horizontal Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {developmentProcess.map((stage) => {
            const StageIcon = (stage.iconName && stageIconMap[stage.iconName]) || Search;
            return (
              <div
                key={stage.step}
                className="glass-card group relative flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 hover:shadow-lg"
              >
                <div>
                  {/* Step Marker */}
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric-soft text-electric transition-colors duration-200 group-hover:bg-electric group-hover:text-white">
                        <StageIcon size={17} />
                      </span>
                      <span className="font-mono text-xs font-bold text-electric">
                        STAGE {stage.step}
                      </span>
                    </div>
                    <span className="font-display text-xs font-semibold text-ink-3">
                      {stage.tagline}
                    </span>
                  </div>

                  <h3 className="font-display mt-5 text-2xl font-bold text-ink">
                    {stage.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-ink-2 sm:text-sm">
                    {stage.description}
                  </p>

                  {/* Key Outputs */}
                  <div className="mt-6 rounded-2xl border border-line bg-surface-2/50 p-4">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-2">
                      Key Outputs &amp; Milestones
                    </span>
                    <div className="space-y-1.5">
                      {stage.keyOutputs.map((output) => (
                        <div key={output} className="flex items-center gap-2 text-xs text-ink-2">
                          <CheckCircle2 size={13} className="text-electric shrink-0" />
                          <span>{output}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-line/40 text-[11px] font-medium text-ink-3">
                  Phase {stage.step} Milestone Delivery
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
