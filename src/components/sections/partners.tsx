"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Layers, Users, Building2 } from "lucide-react";
import { verifiedPartners } from "@/lib/site";

export function PartnersSection() {
  // Double the array for seamless infinite looping
  const marqueeItems = [...verifiedPartners, ...verifiedPartners];

  return (
    <section id="trust" className="relative pt-8 pb-12 sm:pt-10 sm:pb-16 md:pt-14 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        {/* Section 03: Authentic Credibility & Capabilities Grid */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-ink">
            Practical Capabilities. Honest Engineering.
          </h2>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-base leading-relaxed text-ink-2">
            We prioritize authentic delivery over exaggerated marketing metrics. Every project we undertake
            benefits from structured engineering principles, transparent milestones, and direct communication.
          </p>
        </div>

        {/* 4 Pillars of Authentic Capability */}
        <div className="mt-7 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          <div className="glass-card rounded-2xl p-4 sm:p-6 transition-all">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Building2 size={18} className="sm:size-5" />
            </div>
            <h3 className="font-display mt-3 sm:mt-4 text-sm sm:text-base font-bold text-ink">Dual-Region Delivery</h3>
            <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs leading-relaxed text-ink-2">
              Strategic roots in China combined with our primary engineering operations hub in Dhaka, Bangladesh.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-6 transition-all">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Layers size={18} className="sm:size-5" />
            </div>
            <h3 className="font-display mt-3 sm:mt-4 text-sm sm:text-base font-bold text-ink">Full-Stack Autonomy</h3>
            <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs leading-relaxed text-ink-2">
              End-to-end expertise spanning UX design, Next.js web applications, relational databases, and cloud DevOps.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-6 transition-all">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <ShieldCheck size={18} className="sm:size-5" />
            </div>
            <h3 className="font-display mt-3 sm:mt-4 text-sm sm:text-base font-bold text-ink">Codebase Longevity</h3>
            <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs leading-relaxed text-ink-2">
              Strict TypeScript types, automated linting, modular patterns, and clear documentation that your team can own.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-6 transition-all">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Users size={18} className="sm:size-5" />
            </div>
            <h3 className="font-display mt-3 sm:mt-4 text-sm sm:text-base font-bold text-ink">Collaborative Team</h3>
            <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs leading-relaxed text-ink-2">
              You work directly with the developers and designers crafting your product, not through layers of account managers.
            </p>
          </div>
        </div>

        {/* Section 04: Trusted By / Clients & Collaborators Infinite Marquee */}
        <div className="mt-8 pt-7 sm:mt-16 sm:pt-12 border-t border-line/70">
          <div className="text-center mb-4 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-ink-3">
              Trusted Relationships &amp; Ecosystem Collaborations
            </span>
          </div>

          <div className="marquee-mask marquee-paused relative overflow-hidden py-1 sm:py-2">
            <div className="flex w-max items-center gap-4 sm:gap-6 animate-marquee">
              {marqueeItems.map((partner, idx) => (
                <div
                  key={`${partner.name}-${idx}`}
                  className="flex h-16 w-32 sm:h-24 sm:w-44 shrink-0 items-center justify-center p-2.5 sm:p-4"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
