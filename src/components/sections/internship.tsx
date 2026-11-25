"use client";

import { useState } from "react";
import { GraduationCap, BookOpen, Users, Award, CheckCircle2, ArrowRight, Laptop, Briefcase } from "lucide-react";
import { internshipTracks, type InternshipTrack } from "@/lib/site";
import Link from "next/link";

export function InternshipSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Engineering", "Design", "Infrastructure", "Business"];

  const filteredTracks = activeCategory === "All"
    ? internshipTracks
    : internshipTracks.filter((t) => t.category === activeCategory);

  return (
    <section id="internship" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            The WIZZO Internship Program: Practical Engineering &amp; Mentorship
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-2 sm:text-base">
            We believe the best way to master technology is through practical, supervised experience.
            Our structured internship program pairs emerging developers and designers with experienced
            mentors to work on real-world projects and build genuine portfolio-grade skills.
          </p>
        </div>

        {/* 4 Pillars of the Program */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Users size={19} />
            </span>
            <h4 className="font-display mt-4 font-bold text-ink">Dedicated 1-on-1 Mentorship</h4>
            <p className="mt-1 text-xs text-ink-2">
              Every intern is paired with a senior engineer or designer who conducts weekly code and design reviews.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Laptop size={19} />
            </span>
            <h4 className="font-display mt-4 font-bold text-ink">Real Project Workflows</h4>
            <p className="mt-1 text-xs text-ink-2">
              No hypothetical toy exercises. You contribute to genuine client modules, bug fixes, and feature additions.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <BookOpen size={19} />
            </span>
            <h4 className="font-display mt-4 font-bold text-ink">Structured Curriculum</h4>
            <p className="mt-1 text-xs text-ink-2">
              A phased learning roadmap guiding you from modern fundamentals to production deployment and testing.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Award size={19} />
            </span>
            <h4 className="font-display mt-4 font-bold text-ink">Completion Certificate</h4>
            <p className="mt-1 text-xs text-ink-2">
              Receive verified institutional credentials documenting your completed tasks and technical tracks.
            </p>
          </div>
        </div>

        {/* Track Category Filters */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-10 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold text-ink">
              10 Specialized Tracks
            </h3>
            <p className="text-xs text-ink-3 mt-1">
              Select a discipline to explore technical focus and curriculum scope.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? "border-electric bg-electric text-white"
                    : "border-line bg-surface text-ink-2 hover:border-electric/50 hover:text-ink dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className="glass-card flex flex-col justify-between rounded-3xl p-6 transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="rounded-full bg-electric-soft px-2.5 py-0.5 text-[10px] font-mono font-semibold text-electric">
                    {track.category}
                  </span>
                  <span className="text-[11px] text-ink-3">
                    {track.duration}
                  </span>
                </div>

                <h4 className="font-display mt-4 text-lg font-bold text-ink">
                  {track.title}
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-ink-2">
                  {track.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {track.skillsGained.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-ink-3"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line/60">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-electric hover:underline"
                >
                  Apply for this Track via Contact
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Application CTA Callout (Honest & Transparent) */}
        <div className="mt-14 rounded-3xl border border-line bg-surface-2/70 p-8 text-center md:p-12">
          <GraduationCap size={32} className="mx-auto text-electric" />
          <h3 className="font-display mt-4 text-2xl font-bold text-ink sm:text-3xl">
            Interested in Joining the Next Cohort?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-ink-2 sm:text-sm">
            We welcome motivated students and recent graduates in CSE, EEE, Design, and related disciplines.
            Applications are evaluated on personal dedication, foundational problem-solving, and willingness to learn.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="#contact"
              className="btn-primary inline-flex items-center gap-2 rounded-xl bg-electric px-6 py-3 text-xs font-semibold text-white shadow-md shadow-electric/25"
            >
              <span>Submit Internship Inquiry</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <p className="mt-4 text-[11px] text-ink-3">
            Note: Informational program. We maintain honest admissions and do not make false employment guarantees.
          </p>
        </div>
      </div>
    </section>
  );
}
