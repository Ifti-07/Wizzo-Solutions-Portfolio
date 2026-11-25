"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, Layers, Users, Building, Laptop, ArrowRight } from "lucide-react";
import { verifiedPartners } from "@/lib/site";

export function PartnersSection() {
  // Double the array for seamless infinite looping
  const marqueeItems = [...verifiedPartners, ...verifiedPartners];

  return (
    <section id="trust" className="relative py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Section 03: Authentic Credibility & Capabilities Grid */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Practical Capabilities. Honest Engineering.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-2 sm:text-base">
            We prioritize authentic delivery over exaggerated marketing metrics. Every project we undertake
            benefits from structured engineering principles, transparent milestones, and direct communication.
          </p>
        </div>

        {/* 4 Pillars of Authentic Capability */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card rounded-2xl p-6 transition-all">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Building size={20} />
            </div>
            <h3 className="font-display mt-4 font-bold text-ink">Dual-Region Delivery</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-2">
              Strategic roots in China combined with our primary engineering operations hub in Dhaka, Bangladesh.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 transition-all">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Layers size={20} />
            </div>
            <h3 className="font-display mt-4 font-bold text-ink">Full-Stack Autonomy</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-2">
              End-to-end expertise spanning UX design, Next.js web applications, relational databases, and cloud DevOps.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 transition-all">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-display mt-4 font-bold text-ink">Codebase Longevity</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-2">
              Strict TypeScript types, automated linting, modular patterns, and clear documentation that your team can own.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 transition-all">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Users size={20} />
            </div>
            <h3 className="font-display mt-4 font-bold text-ink">Collaborative Team</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-2">
              You work directly with the developers and designers crafting your product, not through layers of account managers.
            </p>
          </div>
        </div>

        {/* Section 04: Trusted By / Clients & Collaborators Infinite Marquee */}
        <div className="mt-16 pt-12 border-t border-line/70">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-3">
              Trusted Relationships &amp; Ecosystem Collaborations
            </span>
          </div>

          <div className="marquee-mask marquee-paused relative overflow-hidden py-2">
            <div className="flex w-max items-center gap-6 animate-marquee">
              {marqueeItems.map((partner, idx) => (
                <div
                  key={`${partner.name}-${idx}`}
                  className="flex h-24 w-44 shrink-0 items-center justify-center p-4"
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
