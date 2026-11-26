"use client";

import { Target, Layers, MessageSquare, Heart, Globe, Handshake, ArrowRight } from "lucide-react";
import { whyChooseReasons } from "@/lib/site";
import Link from "next/link";

const iconList = [Target, Layers, MessageSquare, Heart, Globe, Handshake];

export function WhyUsSection() {
  return (
    <section id="why-wizzo" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Thoughtful Engineering That Puts Your Business First
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-2 sm:text-base">
            Software projects fail when teams prioritize buzzwords over business realities. Here is how
            our working methodology ensures your project stays on track, within budget, and built to last.
          </p>
        </div>

        {/* Narrative Comparison & Principles (Visual Storytelling Layout) */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {whyChooseReasons.map((reason, idx) => {
            const Icon = iconList[idx] || Target;
            return (
              <div
                key={reason.number}
                className="glass-card group relative flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-line/70 pb-4">
                    <span className="font-mono text-sm font-bold text-electric">
                      {reason.number}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-ink-2 group-hover:bg-electric group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </span>
                  </div>

                  <h3 className="font-display mt-5 text-xl font-bold text-ink">
                    {reason.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-ink-2 sm:text-sm">
                    {reason.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-line/40 text-[11px] text-ink-3">
                  Verified Principle • Continuous Engagement
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Editorial Callout */}
        <div className="mt-12 rounded-3xl border border-line bg-surface-2/60 p-8 text-center md:p-10">
          <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
            Looking for an engineering team that truly understands your commercial goals?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-xs text-ink-2 sm:text-sm">
            We schedule initial technical discovery conversations with zero sales pressure. Let&apos;s evaluate
            what you need and how we can help.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="#contact"
              className="btn-primary inline-flex items-center gap-2 rounded-xl bg-electric px-6 py-3 text-xs font-semibold text-white shadow-md shadow-electric/25"
            >
              <span>Schedule a Technical Discovery Call</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
