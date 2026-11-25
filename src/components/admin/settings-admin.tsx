"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Globe2 } from "lucide-react";
import { adminSaveSettings } from "@/lib/actions/admin";
import { Card, AdminButton, Field, inputCls } from "./ui";
import { site } from "@/lib/site";

export function SettingsAdmin({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const v = (key: string, fallback = "") => settings[key] ?? fallback;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Website Settings</h1>
      <p className="mt-1.5 text-sm text-ink-2">
        Update company contact details and social links shown across the website.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const fd = new FormData(e.currentTarget);
          const pairs: Record<string, string> = {};
          for (const [k, val] of fd.entries()) pairs[k] = String(val);
          await adminSaveSettings(pairs);
          setBusy(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
          router.refresh();
        }}
        className="mt-7 grid gap-5 lg:grid-cols-2"
      >
        <Card>
          <h2 className="font-display flex items-center gap-2 font-bold text-ink">
            <Globe2 size={17} className="text-electric" /> Company Contact
          </h2>
          <div className="mt-5 space-y-4">
            <Field label="Company Email">
              <input name="site_email" className={inputCls} defaultValue={v("site_email", site.email)} />
            </Field>
            <Field label="Phone Number">
              <input name="site_phone" className={inputCls} defaultValue={v("site_phone", site.phone)} />
            </Field>
            <Field label="Bangladesh Office Address">
              <input name="bd_office" className={inputCls} defaultValue={v("bd_office", site.offices[0].address)} />
            </Field>
            <Field label="International Office">
              <input name="intl_office" className={inputCls} defaultValue={v("intl_office", site.offices[1].address)} />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-ink">Social Media Links</h2>
          <div className="mt-5 space-y-4">
            {(["facebook", "linkedin", "x", "instagram"] as const).map((s) => (
              <Field key={s} label={s[0].toUpperCase() + s.slice(1)}>
                <input name={`social_${s}`} className={inputCls} placeholder="https://" defaultValue={v(`social_${s}`)} />
              </Field>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-electric-soft p-4 text-xs leading-relaxed text-ink-2">
            Changes apply to the footer and contact section of the public website. Statistics,
            global presence and other homepage content remain in the central site configuration.
          </div>
        </Card>

        <div className="lg:col-span-2">
          <AdminButton type="submit" disabled={busy} className="!px-8 !py-3.5 !text-sm">
            <Save size={16} /> {busy ? "Saving..." : saved ? "Saved!" : "Save All Settings"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
