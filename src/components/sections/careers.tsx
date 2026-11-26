"use client";

import Link from "next/link";
import {
  Code2,
  Palette,
  Cpu,
  Workflow,
  ArrowRight,
} from "lucide-react";

const areasOfInterest = [
  {
    title: "Software & Web Development",
    description: "Full-stack web applications, robust APIs, and modern cloud architectures.",
    icon: Code2,
  },
  {
    title: "UI/UX Design",
    description: "Design systems, human-centered product interfaces, and digital experiences.",
    icon: Palette,
  },
  {
    title: "AI & Emerging Technologies",
    description: "Intelligent workflow automation, applied AI solutions, and data pipelines.",
    icon: Cpu,
  },
  {
    title: "Digital Solutions & Business Innovation",
    description: "Enterprise operational software, process optimization, and digital strategy.",
    icon: Workflow,
  },
];

export function CareersSection() {
  return (
    <section id="careers" className="relative scroll-mt-24 py-24 md:scroll-mt-28 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* Left Column: Narrative & Primary Action */}
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Build Your Future With WIZZO
            </h2>

            <p className="mt-5 text-base leading-relaxed text-ink-2 sm:text-lg">
              We&apos;re always interested in connecting with passionate developers, designers, and creative thinkers who want to build meaningful digital experiences.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
              At WIZZO Solutions, we value curiosity, collaboration, and continuous growth. Join us in contributing to innovative digital solutions that create real value for businesses.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/careers"
                className="group inline-flex items-center gap-2 rounded-xl bg-electric px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-electric/25 transition-all hover:bg-electric-hover active:scale-[0.98]"
              >
                <span>Explore Career Opportunities</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/80 px-5 py-3.5 text-sm font-medium text-ink transition-colors hover:border-electric hover:text-electric active:scale-[0.98]"
              >
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Areas of Interest Grid */}
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink sm:text-base">
                Areas of Interest
              </h3>
              <span className="font-mono text-xs font-semibold text-electric">
                4 Core Disciplines
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {areasOfInterest.map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.title}
                    className="group relative flex flex-col justify-between rounded-2xl border border-line/70 bg-surface/80 p-5 transition-all duration-300 hover:border-electric/50 hover:shadow-md"
                  >
                    <div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric transition-colors group-hover:bg-electric group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h4 className="font-display mt-4 font-bold text-ink text-sm sm:text-base">
                        {area.title}
                      </h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                        {area.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
