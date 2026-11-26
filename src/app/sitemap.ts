import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://wizzosolutions.com";
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/careers`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/login`, lastModified: new Date(), priority: 0.4 },
  ];
}
