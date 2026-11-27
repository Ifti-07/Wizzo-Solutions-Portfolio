"use client";

import { Quote, Building2 } from "lucide-react";
import { clientTestimonials, type TestimonialItem } from "@/lib/site";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:heading-2 font-semibold tracking-tight text-ink [text-wrap:balance]">
            Genuine feedback from verified project engagements
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs leading-relaxed text-ink-2 sm:text-base">
            We value lasting client relationships built on accountability, transparent communication,
            and software that performs reliably in production every single day.
          </p>
        </div>

        {/* Testimonials Cards Grid (Horizontal snap on mobile) */}
        <div className="mt-7 sm:mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0 lg:grid-cols-3">
          {clientTestimonials.map((item) => (
            <div
              key={item.id}
              className="glass-card flex w-[84vw] shrink-0 snap-start flex-col justify-between rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:w-auto transition-all hover:shadow-lg"
            >
              <div>
                <Quote size={22} className="text-electric/40 mb-3 sm:size-7 sm:mb-4" />
                <p className="text-xs sm:text-base leading-relaxed text-ink font-medium">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="mt-5 sm:mt-8 border-t border-line/70 pt-4 sm:pt-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-ink">
                      {item.clientName}
                    </h4>
                    <p className="text-xs text-ink-3">
                      {item.role} • {item.company}
                    </p>
                  </div>
                  <span className="rounded bg-surface-2 p-1.5 text-ink-3">
                    <Building2 size={15} />
                  </span>
                </div>

                <div className="mt-3 rounded-xl bg-surface-2/60 px-3 py-1.5 text-[11px] text-ink-2">
                  <span className="font-semibold text-electric">Context: </span>
                  {item.projectContext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
