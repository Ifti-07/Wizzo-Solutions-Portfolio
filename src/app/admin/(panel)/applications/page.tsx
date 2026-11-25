import type { Metadata } from "next";
import { getApplications } from "@/lib/actions/admin";
import { ApplicationsAdmin } from "@/components/admin/applications-admin";

export const metadata: Metadata = { title: "Job Applications" };
export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const applications = await getApplications();
  return <ApplicationsAdmin applications={applications} />;
}
