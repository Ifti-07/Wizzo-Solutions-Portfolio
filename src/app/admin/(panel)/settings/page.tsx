import type { Metadata } from "next";
import { getSettings } from "@/lib/actions/admin";
import { SettingsAdmin } from "@/components/admin/settings-admin";

export const metadata: Metadata = { title: "Website Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return <SettingsAdmin settings={settings} />;
}
