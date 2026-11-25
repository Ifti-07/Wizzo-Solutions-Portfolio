"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal, SectionTag, AnimatedWords } from "@/components/ui/reveal";
import { site } from "@/lib/site";

export function GlobalPresenceSection() {
  const [a, b] = site.presence;

  return (
    <section id="global" className="relative overflow-hidden bg-navy py-24 text-white md:py-32 dark:bg-abyss">
      {/* background flair */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-bg opacity-[0.15]" />
        <div className="animate-aurora absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-electric/30 blur-[140px]" />
        <div className="animate-aurora absolute right-0 top-0 h-80 w-80 rounded-full bg-[#3d78ff]/25 blur-[130px] [animation-delay:4s]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <SectionTag className="justify-start">
            <span className="text-[#8ab8ff]">Global Presence</span>
          </SectionTag>
          <h2 className="font-display mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl">
            <AnimatedWords text="From Asia to the World." accentWords={["World."]} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-lg leading-relaxed text-white/65">
              Born in China, growing across Asia, and proudly operating in Bangladesh — Wizzo
              Solutions connects global expertise with local dedication, wherever your business
              needs to go next.
            </p>
          </Reveal>

          <div className="mt-9 space-y-4">
            {site.presence.map((p, i) => (
              <Reveal key={p.country} delay={0.2 + i * 0.12}>
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-electric/50">
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-electric text-white">
                    <MapPin size={18} />
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping-dot rounded-full bg-[#5c9dff]" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#8ab8ff]" />
                    </span>
                  </span>
                  <div>
                    <p className="font-display font-bold">{p.country}</p>
                    <p className="text-sm text-white/55">{p.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <Link
              href="#contact"
              className="btn-primary mt-9 inline-flex items-center gap-2 rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-12px_var(--glow)] transition-transform hover:scale-[1.04]"
            >
              Start a Global Project <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>

        {/* Visualization */}
        <Reveal delay={0.2} className="relative">
          <div className="relative mx-auto aspect-square max-w-[540px]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="arc" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3d78ff" />
                  <stop offset="100%" stopColor="#5c9dff" />
                </linearGradient>
              </defs>
              {/* globe */}
              <circle cx="50" cy="50" r="46" fill="rgba(7,85,245,0.07)" stroke="rgba(92,157,255,0.35)" strokeWidth="0.35" />
              <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(92,157,255,0.18)" strokeWidth="0.25" />
              <ellipse cx="50" cy="50" rx="46" ry="18" fill="none" stroke="rgba(92,157,255,0.22)" strokeWidth="0.3" />
              <ellipse cx="50" cy="50" rx="18" ry="46" fill="none" stroke="rgba(92,157,255,0.22)" strokeWidth="0.3" />
              <ellipse cx="50" cy="50" rx="32" ry="46" fill="none" stroke="rgba(92,157,255,0.12)" strokeWidth="0.3" />
              <ellipse cx="50" cy="50" rx="46" ry="34" fill="none" stroke="rgba(92,157,255,0.12)" strokeWidth="0.3" />
              {/* connection arc between the two presence points */}
              {a && b && (
                <motion.path
                  d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2 - 6} ${Math.min(a.y, b.y) - 12} ${b.x} ${b.y}`}
                  fill="none"
                  stroke="url(#arc)"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  strokeDasharray="2.5 3.5"
                  className="animate-dash"
                />
              )}
            </svg>

            {/* location nodes */}
            {site.presence.map((p, i) => (
              <div
                key={p.country}
                className="absolute"
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.25, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <span className="absolute -inset-3 animate-ping-dot rounded-full bg-electric/50" style={{ animationDelay: `${i * 0.8}s` }} />
                  <span className="relative block h-3.5 w-3.5 rounded-full bg-electric ring-4 ring-electric/30" />
                  <span className="glass absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full !bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                    {p.country}
                  </span>
                </motion.div>
              </div>
            ))}

            {/* orbiting satellite */}
            <div className="animate-spin-slower absolute inset-[6%]">
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#8ab8ff] shadow-[0_0_14px_3px_rgba(92,157,255,0.8)]" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
