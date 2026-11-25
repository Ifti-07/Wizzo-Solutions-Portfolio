"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlowingDataWaves } from "@/components/ui/flowing-data-waves";
import { IsometricArchitecture } from "@/components/ui/isometric-architecture";

const EASE = [0.22, 1, 0.36, 1] as const;

const LAYERS = [
  {
    title: "Client Interfaces and Web Apps",
    right: "Next.js 16 and React 19",
    body: "Server rendered, responsive UI with sub-second delivery and strict accessibility standards.",
    accent: false,
  },
  {
    title: "Business Logic and Automation",
    right: "Active engine",
    body: "Event driven workflows, asynchronous task queues, and automated operational pipelines.",
    accent: true,
  },
  {
    title: "API Gateway and Integrations",
    right: "REST and Webhooks",
    body: "Secure endpoints linking payment channels, ERP databases, and external microservices.",
    accent: false,
  },
  {
    title: "Relational Data Store",
    right: "PostgreSQL and Drizzle",
    body: "ACID compliant storage with automated backups, encrypted secrets, and strict indexing.",
    accent: false,
  },
];

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-[92svh] flex flex-col justify-center overflow-hidden pt-28 pb-14 md:pt-36 md:pb-16"
    >
      {/* Premium Cinematic Flowing Data Waves Background */}
      <div className="absolute inset-x-0 top-0 h-[640px] pointer-events-none overflow-hidden z-0">
        <FlowingDataWaves intensity="medium" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        {/* Main Hero Split Grid */}
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
          {/* Left Column: Outcome Headline & CTA */}
          <div className="text-left">
            <motion.h1
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
              className="text-[36px] leading-[40px] font-semibold tracking-tight text-ink sm:text-[48px] sm:leading-[52px] lg:text-[56px] lg:leading-[60px]"
            >
              <span className="block">Custom software for</span>
              <span className="block">growing businesses</span>
            </motion.h1>

            <motion.p
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15, ease: EASE }}
              className="mt-6 max-w-[540px] text-base leading-7 text-ink-2 sm:text-lg"
            >
              We design web applications, automation and integrations that fit how your team works.
            </motion.p>

            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22, ease: EASE }}
              className="mt-8 flex flex-col items-start gap-4"
            >
              <Link
                href="#contact"
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-electric px-6 text-sm font-semibold text-white transition-all hover:bg-electric-dark hover:shadow-lg hover:shadow-electric/25 active:scale-[0.99]"
              >
                <span>Book a consultation</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Checklist Badges */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.3, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-ink-2"
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={15} className="text-electric" />
                Web applications
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={15} className="text-electric" />
                Business automation
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={15} className="text-electric" />
                API integrations
              </span>
            </motion.div>
          </div>

          {/* Right Column: 3D Floating Isometric Software Architecture Visual */}
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
            className="relative flex items-center justify-center"
          >
            <IsometricArchitecture />
          </motion.div>
        </div>

        {/* Bottom Architectural Specification Bar (4-Column Layout as in Figma) */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35, ease: EASE }}
          className="mt-14 border-t border-line/80 pt-8 md:pt-10 lg:mt-18"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {LAYERS.map((layer, index) => {
              const num = String(index + 1).padStart(2, "0");
              return (
                <div key={layer.title} className="group flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-ink group-hover:text-electric transition-colors">
                      <span className="font-mono text-xs text-ink-3 mr-2">{num}</span>
                      {layer.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 font-mono text-[11px]",
                        layer.accent ? "text-electric font-semibold" : "text-ink-3"
                      )}
                    >
                      {layer.right}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-2">
                      {layer.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
