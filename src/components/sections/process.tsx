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
    <section id="process" className="relative py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:heading-2 font-semibold tracking-tight text-ink [text-wrap:balance]">
            A structured, six stage development workflow
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs leading-relaxed text-ink-2 sm:text-base">
            From initial requirements gathering to final production deployment and ongoing support,
            our transparent process ensures quality, predictable delivery, and zero unpleasant surprises.
          </p>
        </div>

        {/* 6 Stages Timeline / Horizontal Cards */}
        <div className="mt-7 sm:mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-3">
          {developmentProcess.map((stage) => {
            const StageIcon = (stage.iconName && stageIconMap[stage.iconName]) || Search;
            return (
              <div
                key={stage.step}
                className="glass-card group relative flex w-[82vw] shrink-0 snap-start flex-col justify-between rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:w-auto transition-all duration-300 hover:shadow-lg"
              >
                <div>
                  {/* Step Marker */}
                  <div className="flex items-center justify-between border-b border-line pb-3 sm:pb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-electric-soft text-electric transition-colors duration-200 group-hover:bg-electric group-hover:text-white">
                        <StageIcon size={16} className="sm:size-[17px]" />
                      </span>
                      <span className="font-mono text-xs font-bold text-electric">
                        STAGE {stage.step}
                      </span>
                    </div>
                    <span className="font-display text-[11px] sm:text-xs font-semibold text-ink-3">
                      {stage.tagline}
                    </span>
                  </div>

                  <h3 className="font-display mt-4 sm:mt-5 text-lg sm:text-2xl font-bold text-ink">
                    {stage.title}
                  </h3>

                  <p className="mt-2 sm:mt-3 text-xs leading-relaxed text-ink-2 sm:text-sm">
                    {stage.description}
                  </p>

                  {/* Key Outputs */}
                  <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl border border-line bg-surface-2/50 p-3 sm:p-4">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-1.5 sm:mb-2">
                      Key Outputs &amp; Milestones
                    </span>
                    <div className="space-y-1 sm:space-y-1.5">
                      {stage.keyOutputs.map((output) => (
                        <div key={output} className="flex items-center gap-2 text-xs text-ink-2">
                          <CheckCircle2 size={12} className="text-electric shrink-0 sm:size-[13px]" />
                          <span>{output}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-line/40 text-[11px] font-medium text-ink-3">
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
