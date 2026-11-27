"use client";

import { motion } from "framer-motion";
import { Globe, MapPin, Compass, HeartHandshake } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Narrative Left Column */}
          <div>
            <h2 className="font-display mt-2 sm:mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              A Real Technology Team Solving Concrete Business Challenges
            </h2>

            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-ink-2">
              <p>
                WIZZO Solutions was built on a simple premise: businesses don&apos;t need over-engineered,
                bloated software—they need reliable, practical digital tools that work quietly, predictably,
                and effectively.
              </p>
              <p>
                With roots originating in China and expanding delivery capabilities across Asia, our active
                operations hub in <strong>Dhaka, Bangladesh</strong> brings together skilled engineers,
                thoughtful UI/UX designers, and technical consultants who take pride in craftsmanship.
              </p>
              <p>
                We do not pretend to be an impersonal corporate conglomerate. We are a dedicated, agile
                team that collaborates closely with entrepreneurs, procurement leaders, and growing companies
                to modernize how they operate.
              </p>
            </div>

            {/* Core Values Strip */}
            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-line bg-surface p-3.5 sm:p-4">
                <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-electric-soft text-electric">
                  <Compass size={16} className="sm:size-[18px]" />
                </span>
                <h4 className="font-display mt-2.5 sm:mt-3 text-xs sm:text-sm font-bold text-ink">Clarity Over Complexity</h4>
                <p className="mt-1 text-[11px] sm:text-xs text-ink-2">
                  We demystify tech choices. If a simple, battle-tested solution works best, that is what we build.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-3.5 sm:p-4">
                <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-electric-soft text-electric">
                  <HeartHandshake size={16} className="sm:size-[18px]" />
                </span>
                <h4 className="font-display mt-2.5 sm:mt-3 text-xs sm:text-sm font-bold text-ink">Human-First Partnership</h4>
                <p className="mt-1 text-[11px] sm:text-xs text-ink-2">
                  Transparent communication, realistic milestones, and direct access to your engineering team.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Presentation Right Column */}
          <div className="relative">
            <div className="relative mx-auto w-full max-w-lg rounded-2xl sm:rounded-3xl border border-line bg-surface p-4 sm:p-6 shadow-xl md:p-8">
              {/* Top Identity Header */}
              <div className="flex items-center justify-between border-b border-line pb-3.5 sm:pb-5">
                <Logo className="!h-5 sm:!h-6" />
                <span className="rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-[10px] text-ink-3">
                  ESTABLISHED PRESENCE
                </span>
              </div>

              {/* Dual-Presence Map Card */}
              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                <div className="glass-card group rounded-2xl p-3.5 sm:p-4 transition-all">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-electric text-white shadow-md shadow-electric/25">
                        <MapPin size={17} className="sm:size-[18px]" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-display text-sm sm:text-base font-bold text-ink leading-snug">
                          Operations &amp; Delivery Hub
                        </h4>
                        <p className="text-xs text-ink-3">Dhaka, Bangladesh</p>
                      </div>
                    </div>
                    <span className="ml-12 sm:ml-0 self-start shrink-0 whitespace-nowrap rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ACTIVE HUB
                    </span>
                  </div>
                  <p className="mt-2.5 sm:mt-3 text-xs leading-relaxed text-ink-2">
                    Our central development and design center driving core product builds, software quality assurance,
                    and client support.
                  </p>
                </div>

                <div className="glass-card group rounded-2xl p-3.5 sm:p-4 transition-all">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-line text-electric">
                        <Globe size={17} className="sm:size-[18px]" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-display text-sm sm:text-base font-bold text-ink leading-snug">
                          International Office
                        </h4>
                        <p className="text-xs text-ink-3">China</p>
                      </div>
                    </div>
                    <span className="ml-12 sm:ml-0 self-start shrink-0 whitespace-nowrap rounded bg-electric/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-electric">
                      STRATEGIC ORIGIN
                    </span>
                  </div>
                  <p className="mt-2.5 sm:mt-3 text-xs leading-relaxed text-ink-2">
                    Company origin and regional coordination fostering Asian technical partnerships and enterprise standards.
                  </p>
                </div>
              </div>

              {/* Verification Metrics (Real, Authentic, Unexaggerated) */}
              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 border-t border-line pt-4 sm:pt-5 text-center">
                <div className="rounded-xl border border-line/60 bg-surface-2/40 p-2.5 sm:p-3">
                  <span className="block font-display text-base sm:text-xl font-bold text-electric">Full Lifecycle</span>
                  <span className="mt-0.5 block text-[11px] text-ink-3">Design to Deployment</span>
                </div>
                <div className="rounded-xl border border-line/60 bg-surface-2/40 p-2.5 sm:p-3">
                  <span className="block font-display text-base sm:text-xl font-bold text-ink">Direct Access</span>
                  <span className="mt-0.5 block text-[11px] text-ink-3">To Senior Engineers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
