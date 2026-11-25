import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JobsList, type JobItem } from "@/components/careers/jobs-list";
import { Reveal } from "@/components/ui/reveal";
import { GraduationCap, Rocket, Users2, Globe2, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers & Internship Program",
  description:
    "Join Wizzo Solutions — explore internship and full-time opportunities and work on international technology projects.",
};

export const dynamic = "force-dynamic";

const perks = [
  { icon: GraduationCap, title: "Structured Mentorship", text: "Every intern is paired with an experienced mentor and a clear learning path." },
  { icon: Globe2, title: "International Exposure", text: "Contribute to real projects for clients across Asia and beyond." },
  { icon: Rocket, title: "Fast Growth", text: "Outstanding interns are offered full-time positions and certificates." },
  { icon: Users2, title: "Modern Culture", text: "Flexible, collaborative and engineering-driven environment." },
];

async function getJobs(): Promise<JobItem[]> {
  try {
    const rows = await db.select().from(jobs).where(eq(jobs.open, true)).orderBy(desc(jobs.createdAt));
    return rows.map((j) => ({
      id: j.id,
      title: j.title,
      type: j.type,
      category: j.category,
      location: j.location,
      description: j.description,
      requirements: j.requirements,
      deadline: j.deadline ? j.deadline.toISOString() : null,
    }));
  } catch {
    return [];
  }
}

export default async function CareersPage() {
  const jobList = await getJobs();
  const internships = jobList.filter((j) => j.type === "INTERNSHIP");

  return (
    <>
      <Navbar />
      <main className="pt-28">
        {/* Hero */}
        <section className="relative overflow-hidden pb-16 pt-10 md:pb-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
            <div className="animate-aurora absolute -top-32 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-electric/20 blur-[130px]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-5 text-center md:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-electric shadow-sm">
                <Sparkles size={13} /> Careers & Internship Program
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.05] text-ink sm:text-6xl">
                Build the Future <span className="text-gradient">With Us</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-ink-2 md:text-lg">
                Wizzo Solutions is hiring interns and full-time professionals. Work on real
                international projects, grow your skills and become part of a global technology
                team.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#openings"
                className="btn-primary inline-flex items-center gap-2 rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-12px_var(--glow)] transition-transform hover:scale-[1.04]"
              >
                Browse {jobList.length} Open Position{jobList.length === 1 ? "" : "s"}
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink-2">
                <GraduationCap size={15} className="text-electric" />
                {internships.length} Internship{internships.length === 1 ? "" : "s"} Available
              </span>
            </Reveal>
          </div>
        </section>

        {/* Perks */}
        <section className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="glow-card h-full rounded-3xl border border-line bg-surface p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-electric-soft text-electric">
                    <p.icon size={19} />
                  </span>
                  <h3 className="font-display mt-4 font-bold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Openings */}
        <section id="openings" className="mx-auto max-w-5xl scroll-mt-28 px-5 py-20 md:px-8 md:py-28">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Current Openings</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-2">
              Find the role that fits you. Applications are reviewed on a rolling basis — apply
              early.
            </p>
          </Reveal>
          <JobsList jobs={jobList} />
        </section>
      </main>
      <Footer />
    </>
  );
}
