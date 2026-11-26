import type { Metadata } from "next";
import Link from "next/link";
import { db, pool } from "@/db";
import { jobs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ensureDatabaseSchema } from "@/db/auto-migrate";
import { getStoredJobs } from "@/lib/jobs-store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JobsList, type JobItem } from "@/components/careers/jobs-list";
import { Reveal } from "@/components/ui/reveal";
import { Briefcase, Rocket, Users2, Globe2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers at WIZZO | Technology & Digital Solutions",
  description:
    "Join WIZZO Solutions — connect with our team of developers, designers, and creative thinkers building meaningful digital experiences.",
};

export const dynamic = "force-dynamic";

const perks = [
  { icon: Globe2, title: "High-Impact Projects", text: "Contribute to enterprise-grade web applications and meaningful digital solutions." },
  { icon: Rocket, title: "Continuous Growth", text: "Engage in collaborative code reviews, technical challenges, and modern toolchains." },
  { icon: Users2, title: "Modern Culture", text: "Flexible, engineering-driven environment focused on curiosity and mutual respect." },
  { icon: Briefcase, title: "True Ownership", text: "Take ownership of your architectural decisions and create real business value." },
];

async function getJobs(): Promise<JobItem[]> {
  if (pool) {
    try {
      await ensureDatabaseSchema();
      const rows = await db.select().from(jobs).where(eq(jobs.open, true)).orderBy(desc(jobs.createdAt));
      if (rows && rows.length > 0) {
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
      }
    } catch {
      /* Fallback to stored jobs */
    }
  }
  const fileJobs = await getStoredJobs();
  return fileJobs
    .filter((j) => j.open)
    .map((j) => ({
      id: j.id,
      title: j.title,
      type: j.type,
      category: j.category,
      location: j.location,
      description: j.description,
      requirements: j.requirements,
      deadline: j.deadline,
    }));
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
              <h1 className="font-display mx-auto max-w-3xl text-4xl font-bold leading-[1.05] text-ink sm:text-6xl">
                Build Your Future <span className="text-gradient">With WIZZO</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-ink-2 md:text-lg">
                We&apos;re always interested in connecting with passionate developers, designers, and creative thinkers who want to build meaningful digital experiences and create real business value.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#openings"
                className="btn-primary inline-flex items-center gap-2 rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-12px_var(--glow)] transition-transform hover:scale-[1.04]"
              >
                Browse {jobList.length} Open Position{jobList.length === 1 ? "" : "s"}
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink-2 hover:border-electric hover:text-electric transition-colors"
              >
                Send General Application
              </Link>
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
