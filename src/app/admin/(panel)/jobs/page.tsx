import type { Metadata } from "next";
import { adminGetJobs } from "@/lib/actions/admin";
import { JobsAdmin } from "@/components/admin/jobs-admin";

export const metadata: Metadata = { title: "Job Openings" };
export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await adminGetJobs();
  return <JobsAdmin jobs={jobs} />;
}
