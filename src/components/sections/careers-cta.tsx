"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Briefcase } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function CareersCta() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-electric via-[#0a45cc] to-navy p-10 text-center text-white md:p-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 grid-bg opacity-20" />
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-[90px]" />
              <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#8ab8ff]/25 blur-[90px]" />
            </div>

            <div className="relative">
              <div className="mx-auto flex w-max items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur">
                <GraduationCap size={14} />
                We Are Hiring Interns
              </div>
              <h2 className="font-display mx-auto mt-6 max-w-2xl text-4xl font-bold leading-[1.06] sm:text-5xl">
                Start Your Career With Wizzo Solutions
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-white/75">
                Join our internship program or apply for full-time roles — work on real
                international projects, learn from experienced mentors and grow with a global team.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <Link
                  href="/careers"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-navy transition-transform hover:scale-[1.04] sm:w-auto"
                >
                  View Open Positions
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/careers#apply"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/35 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  <Briefcase size={15} />
                  Apply for Internship
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
