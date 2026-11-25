import type { Metadata } from "next";
import { getContent } from "@/lib/actions/admin";
import { ContentAdmin } from "@/components/admin/content-admin";

export const metadata: Metadata = { title: "Website Content" };
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const content = await getContent();
  return <ContentAdmin {...content} />;
}
