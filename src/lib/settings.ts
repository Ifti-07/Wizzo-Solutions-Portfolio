import "server-only";
import { cache } from "react";
import { db, pool } from "@/db";
import { settings } from "@/db/schema";
import { site } from "@/lib/site";

export type SiteRuntime = {
  email: string;
  phone: string;
  bdOffice: string;
  intlOffice: string;
  socials: { label: string; href: string }[];
};

/** Load website settings saved via the admin panel, falling back to site.ts defaults. */
export const getSiteRuntime = cache(async (): Promise<SiteRuntime> => {
  const fallback: SiteRuntime = {
    email: site.email,
    phone: site.phone,
    bdOffice: site.offices[0].address,
    intlOffice: site.offices[1].address,
    socials: site.socials,
  };
  if (!pool) {
    return fallback;
  }
  try {
    const rows = await db.select().from(settings);
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const socials = [
      { label: "Facebook", href: map.social_facebook || site.socials[0].href },
      { label: "LinkedIn", href: map.social_linkedin || site.socials[1].href },
      { label: "X", href: map.social_x || site.socials[2].href },
      { label: "Instagram", href: map.social_instagram || site.socials[3].href },
    ];
    return {
      email: map.site_email || fallback.email,
      phone: map.site_phone || fallback.phone,
      bdOffice: map.bd_office || fallback.bdOffice,
      intlOffice: map.intl_office || fallback.intlOffice,
      socials,
    };
  } catch {
    return fallback;
  }
});
