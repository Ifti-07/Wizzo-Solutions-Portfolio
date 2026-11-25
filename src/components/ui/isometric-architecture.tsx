"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Shield, Code2, Database, Network, Cpu, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export function IsometricArchitecture({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("relative mx-auto w-full max-w-[580px] select-none", className)}>
      {/* Top Header Label */}
      <div className="mb-2 flex items-center justify-center px-2">
        <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-3">
          System Architecture
        </span>
      </div>

      {/* 3D Isometric Viewport Container */}
      <div className="relative flex h-[390px] sm:h-[460px] w-full items-center justify-center [perspective:1400px] scale-[0.82] xs:scale-[0.9] sm:scale-100 transition-transform origin-center">
        {/* Floating Bracket Badge (Left) */}
        <motion.div
          animate={reduce ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1 sm:left-6 top-20 sm:top-16 z-40 flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface/90 font-mono text-[13px] font-bold text-electric shadow-lg backdrop-blur-md"
        >
          {"{ }"}
        </motion.div>

        {/* Floating Network Badge (Right) */}
        <motion.div
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute right-1 sm:right-6 top-32 sm:top-28 z-40 flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface/90 text-ink-2 shadow-lg backdrop-blur-md"
        >
          <Network size={16} />
        </motion.div>

        {/* Isometric 3D World */}
        <div
          className="relative flex items-center justify-center [transform-style:preserve-3d]"
          style={{
            transform: "rotateX(58deg) rotateZ(-38deg) translateY(-20px)",
          }}
        >
          {/* LAYER 4: Relational Data Store (Base Layer) */}
          <div
            className="absolute [transform-style:preserve-3d]"
            style={{ transform: "translate3d(45px, 85px, -80px)" }}
          >
            <motion.div
              animate={reduce ? {} : { y: [0, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              className={cn(
                "h-[165px] w-[265px] sm:h-[190px] sm:w-[305px] rounded-2xl border p-4 transition-all duration-300",
                isDark
                  ? "border-white/10 bg-[#0d1524]/95 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                  : "border-line bg-surface/95 shadow-[0_18px_40px_-12px_rgba(17,24,39,0.15)]"
              )}
            >
              <div className="flex items-center justify-between border-b border-line/60 pb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-ink-3">
                  04 / Data Store
                </span>
                <Database size={13} className="text-ink-3" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((col) => (
                  <div
                    key={col}
                    className="rounded-lg border border-line/40 bg-bg/60 p-2 text-center"
                  >
                    <div className="mx-auto h-1.5 w-6 rounded-full bg-electric/40" />
                    <div className="mt-2 h-1 w-full rounded bg-line" />
                    <div className="mt-1 h-1 w-2/3 rounded bg-line" />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-[8px] font-mono text-ink-3">
                <span>PostgreSQL • ACID</span>
                <span>Encrypted</span>
              </div>
            </motion.div>
          </div>

          {/* LAYER 3: API Gateway & Integrations */}
          <div
            className="absolute [transform-style:preserve-3d]"
            style={{ transform: "translate3d(18px, 32px, -20px)" }}
          >
            <motion.div
              animate={reduce ? {} : { y: [0, -4, 0] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className={cn(
                "h-[165px] w-[265px] sm:h-[190px] sm:w-[305px] rounded-2xl border p-4 transition-all duration-300 backdrop-blur-md",
                isDark
                  ? "border-electric/30 bg-[#111c30]/90 shadow-[0_18px_45px_rgba(0,0,0,0.7)]"
                  : "border-line bg-surface/90 shadow-[0_16px_35px_-10px_rgba(17,24,39,0.12)]"
              )}
            >
              <div className="flex items-center justify-between border-b border-line/60 pb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-ink-3">
                  03 / API Gateway
                </span>
                <span className="font-mono text-[9px] text-electric">REST / Webhooks</span>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between rounded-md border border-line/50 bg-bg/40 px-2.5 py-1 text-[9px] font-mono">
                  <span className="text-electric font-semibold">POST</span>
                  <span className="text-ink-3">/v1/events/dispatch</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center justify-between rounded-md border border-line/50 bg-bg/40 px-2.5 py-1 text-[9px] font-mono">
                  <span className="text-sky-500 font-semibold">GET</span>
                  <span className="text-ink-3">/v1/sync/state</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* LAYER 2: Business Logic & Automation Engine (Vibrant Electric Blue Plate) */}
          <div
            className="absolute [transform-style:preserve-3d]"
            style={{ transform: "translate3d(-10px, -20px, 35px)" }}
          >
            <motion.div
              animate={reduce ? {} : { y: [0, -5, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className={cn(
                "h-[165px] w-[265px] sm:h-[190px] sm:w-[305px] rounded-2xl border p-4 transition-all duration-300",
                isDark
                  ? "border-electric/70 bg-electric text-white shadow-[0_22px_60px_-8px_rgba(7,85,245,0.75)]"
                  : "border-electric/50 bg-electric text-white shadow-[0_20px_50px_-10px_rgba(7,85,245,0.5)]"
              )}
            >
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/90">
                  02 / Active Engine
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[8px] font-semibold text-white">
                  Event driven
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-black/15 p-2">
                  <p className="font-mono text-[8px] text-white/70">Task Queues</p>
                  <p className="mt-0.5 font-mono text-[11px] font-bold">1.2ms latency</p>
                </div>
                <div className="rounded-lg bg-black/15 p-2">
                  <p className="font-mono text-[8px] text-white/70">Pipelines</p>
                  <p className="mt-0.5 font-mono text-[11px] font-bold">Automated</p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[8px] font-mono text-white/80">
                <span>Async workers: 16</span>
                <span>Health: 100%</span>
              </div>
            </motion.div>
          </div>

          {/* LAYER 1: Client Interfaces & Web Apps (Top Surface) */}
          <div
            className="absolute [transform-style:preserve-3d]"
            style={{ transform: "translate3d(-38px, -72px, 90px)" }}
          >
            <motion.div
              animate={reduce ? {} : { y: [0, -7, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              className={cn(
                "h-[165px] w-[265px] sm:h-[190px] sm:w-[305px] rounded-2xl border p-4 transition-all duration-300 backdrop-blur-xl",
                isDark
                  ? "border-white/20 bg-[#162236]/95 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.9)]"
                  : "border-line bg-surface/98 shadow-[0_22px_55px_-12px_rgba(17,24,39,0.18)]"
              )}
            >
              {/* Window title bar */}
              <div className="flex items-center justify-between border-b border-line pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-ink-3">
                  01 / Web Interface
                </span>
              </div>

              {/* Simulated UI layout */}
              <div className="mt-3 flex gap-2">
                <div className="w-1/3 rounded-lg border border-line/60 bg-bg/60 p-1.5">
                  <div className="h-2 w-8 rounded bg-electric" />
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full rounded bg-line" />
                    <div className="h-1 w-3/4 rounded bg-line" />
                    <div className="h-1 w-1/2 rounded bg-line" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-10 rounded-lg bg-electric/15 p-2 border border-electric/30">
                    <div className="h-2 w-16 rounded bg-electric" />
                    <div className="mt-1 h-1.5 w-24 rounded bg-ink-2/30" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="h-5 rounded-md bg-bg/80 border border-line/60" />
                    <div className="h-5 rounded-md bg-bg/80 border border-line/60" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Security & Metadata Line */}
      <div className="mt-2 flex items-center justify-between px-3 text-[11px] text-ink-3">
        <span className="flex items-center gap-1.5 font-medium">
          <Shield size={14} className="text-electric" />
          TLS encrypted
        </span>
        <span className="font-mono text-[10px]">4 service layers</span>
      </div>
    </div>
  );
}
