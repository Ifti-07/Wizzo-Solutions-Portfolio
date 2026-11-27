import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { themeInitScript } from "@/components/ui/theme";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Corporate Technology & Digital Engineering`,
    template: `%s | ${site.name}`,
  },
  description: site.heroSubtitle,
  keywords: [
    "WIZZO Solutions",
    "Corporate Technology",
    "Custom Software Development",
    "Web Application Development",
    "Business Automation",
    "API Development",
    "Next.js Development",
    "Dhaka Bangladesh",
    "Technology Partner",
  ],
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: `${site.name} — Corporate Technology & Digital Engineering`,
    description: site.heroSubtitle,
    url: site.url,
    type: "website",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Corporate Technology & Digital Engineering`,
    description: site.heroSubtitle,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#080F20" },
  ],
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: `${site.url}/icon-512.png`,
      email: site.email,
      telephone: site.phone,
      description: site.heroSubtitle,
      sameAs: site.socials.map((s) => s.href),
      address: site.offices.map((o) => ({
        "@type": "PostalAddress",
        addressLocality: o.city,
        addressCountry: o.country,
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.heroSubtitle,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-bg text-ink antialiased selection:bg-electric selection:text-white font-sans">
        <AmbientBackground />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
