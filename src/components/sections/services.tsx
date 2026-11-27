"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Globe,
  AppWindow,
  Workflow,
  Webhook,
  Compass,
  Lightbulb,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  X,
  type LucideIcon,
} from "lucide-react";
import { coreServices, type ServiceItem } from "@/lib/site";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Globe,
  AppWindow,
  Workflow,
  Webhook,
  Compass,
  Lightbulb,
  ShieldCheck,
  // Backwards compatibility fallbacks
  Laptop: AppWindow,
  Bot: Workflow,
  PlugZap: Webhook,
  Cpu: Compass,
};

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const featured = coreServices.slice(0, 2);
  const regular = coreServices.slice(2);

  return (
    <section id="services" className="relative py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display mt-2 sm:mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Practical Technology Services Engineered for Growth
            </h2>
            <p className="mt-2.5 sm:mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-ink-2">
              We provide eight specialized technology practices designed to solve concrete operational
              hurdles, build dependable platforms, and create long-term digital enterprise value.
            </p>
          </div>
        </div>

        {/* Featured Flagship Services (Top 2: Asymmetric Editorial Row) */}
        <div className="mt-7 sm:mt-14 grid gap-4 sm:gap-8 lg:grid-cols-2">
          {featured.map((svc) => {
            const Icon = iconMap[svc.iconName] || Code2;
            return (
              <div
                key={svc.id}
                className="glass-card group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-300 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-electric/10 text-electric transition-colors group-hover:bg-electric group-hover:text-white">
                      <Icon size={20} className="sm:size-6" />
                    </span>
                  </div>

                  <h3 className="font-display mt-4 sm:mt-6 text-lg sm:text-2xl font-bold text-ink">
                    {svc.title}
                  </h3>

                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-ink-2">
                    {svc.fullDescription}
                  </p>

                  <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl border border-line/60 bg-surface-2/60 p-3 sm:p-4">
                    <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-electric">
                      Business Value
                    </span>
                    <p className="mt-1 text-xs text-ink-2">
                      {svc.businessValue}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
                    {svc.deliverables.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-line bg-surface px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs text-ink-2"
                      >
                        <CheckCircle2 size={11} className="text-electric shrink-0 sm:size-3" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 sm:mt-8 border-t border-line pt-4 sm:pt-5">
                  <button
                    type="button"
                    onClick={() => setSelectedService(svc)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-electric transition-colors hover:text-ink dark:hover:text-white"
                  >
                    <span>Read Full Scope &amp; Specifications</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regular Services Grid (Remaining 6 Services — horizontal snap on mobile) */}
        <div className="mt-5 sm:mt-8 flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {regular.map((svc) => {
            const Icon = iconMap[svc.iconName] || Code2;
            return (
              <div
                key={svc.id}
                className="glass-card group flex w-[82vw] shrink-0 snap-start flex-col justify-between rounded-2xl p-5 sm:w-auto sm:p-6 transition-all duration-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric-soft text-electric transition-colors group-hover:bg-electric group-hover:text-white">
                      <Icon size={20} />
                    </span>
                    <span className="font-mono text-[11px] text-ink-3">
                      0{coreServices.indexOf(svc) + 1}
                    </span>
                  </div>

                  <h3 className="font-display mt-5 text-lg font-bold text-ink transition-colors group-hover:text-electric">
                    {svc.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-ink-2">
                    {svc.shortDescription}
                  </p>

                  <div className="mt-4 rounded-lg border border-line bg-surface-2 p-2.5">
                    <p className="text-[11px] text-ink-3">
                      &quot;{svc.businessValue}&quot;
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-line/60">
                  <button
                    type="button"
                    onClick={() => setSelectedService(svc)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-electric transition-colors hover:text-ink dark:hover:text-white"
                  >
                    <span>Details &amp; Deliverables</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl rounded-3xl border border-line bg-surface p-7 shadow-2xl md:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                aria-label="Close modal"
                className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-xl border border-line text-ink-2 transition-colors hover:border-electric hover:text-electric"
              >
                <X size={17} />
              </button>

              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric text-white">
                  {(() => {
                    const ModalIcon = iconMap[selectedService.iconName] || Code2;
                    return <ModalIcon size={24} />;
                  })()}
                </span>
                <div>
                  <span className="font-mono text-xs text-electric">PRACTICE OVERVIEW</span>
                  <h3 className="font-display text-xl font-bold text-ink">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-ink-2">
                {selectedService.fullDescription}
              </p>

              <div className="mt-5 rounded-2xl border border-line bg-surface-2/60 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                  Direct Business Return
                </h4>
                <p className="mt-1 text-xs text-ink-2">
                  {selectedService.businessValue}
                </p>
              </div>

              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
                  Typical Project Deliverables
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {selectedService.deliverables.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-xs text-ink-2"
                    >
                      <CheckCircle2 size={14} className="text-electric shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5">
                <a
                  href="#contact"
                  onClick={() => setSelectedService(null)}
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl bg-electric px-6 py-3 text-xs font-semibold text-white shadow-md shadow-electric/20"
                >
                  Discuss This Service with Us
                  <ArrowUpRight size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="text-xs font-medium text-ink-3 hover:text-ink"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
