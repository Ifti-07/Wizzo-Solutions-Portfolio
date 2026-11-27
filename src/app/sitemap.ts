import type { MetadataRoute } from "next";
import { db, pool } from "@/db";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getStoredJobs } from "@/lib/jobs-store";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

async function getOpenJobIds(): Promise<number[]> {
  if (pool) {
    try {
      const rows = await db
        .select({ id: jobs.id })
        .from(jobs)
        .where(eq(jobs.open, true));
      if (rows.length > 0) return rows.map((r) => r.id);
    } catch {
      /* Fallback to stored jobs if DB is unavailable */
    }
  }
  const fileJobs = await getStoredJobs();
  return fileJobs.filter((j) => j.open).map((j) => j.id);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const jobIds = await getOpenJobIds();

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${site.url}/careers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...jobIds.map((id) => ({
      url: `${site.url}/careers/apply/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
