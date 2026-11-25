import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ApplicationForm } from "@/components/careers/application-form";
import type { JobItem } from "@/components/careers/jobs-list";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Apply — Careers" };
export const dynamic = "force-dynamic";

function toJobItem(j: typeof jobs.$inferSelect): JobItem {
  return {
    id: j.id, title: j.title, type: j.type, category: j.category, location: j.location,
    description: j.description, requirements: j.requirements,
    deadline: j.deadline ? j.deadline.toISOString() : null,
  };
}

export default async function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  let job: JobItem | null = null;
  let allJobs: JobItem[] = [];
  try {
    const rows = await db.select().from(jobs).where(eq(jobs.open, true));
    allJobs = rows.map(toJobItem);
    job = allJobs.find((j) => j.id === Number(jobId)) ?? null;
  } catch {
    /* DB not ready */
  }
  if (jobId !== "general" && !job && allJobs.length > 0) notFound();

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(ellipse_65%_50%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-32 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-electric/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 md:px-8">
          <Reveal>
            <Link href="/careers" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-2 transition-colors hover:text-electric">
              <ArrowLeft size={15} /> Back to all openings
            </Link>
            <h1 className="font-display mt-5 text-3xl font-bold text-ink sm:text-4xl">
              Apply — <span className="text-gradient">{job?.title ?? "General Application"}</span>
            </h1>
            <p className="mt-3 text-ink-2">
              Fill in the form below and attach your CV. Fields marked * are required.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-9">
            <ApplicationForm job={job} allJobs={allJobs} />
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
