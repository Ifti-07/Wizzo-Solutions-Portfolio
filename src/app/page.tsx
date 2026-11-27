import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { PartnersSection } from "@/components/sections/partners";
import { TaglineRevealSection } from "@/components/sections/tagline-reveal";
import { SolutionsSection } from "@/components/sections/solutions";
import { ServicesSection } from "@/components/sections/services";
import { AboutSection } from "@/components/sections/about";
import { WhyUsSection } from "@/components/sections/why-us";
import { ProjectsSection } from "@/components/sections/projects";
import { ProcessSection } from "@/components/sections/process";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { CareersSection } from "@/components/sections/careers";
import { InsightsSection } from "@/components/sections/insights";
import { ContactSection } from "@/components/sections/contact";
import { getSiteRuntime } from "@/lib/settings";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: site.url,
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const config = await getSiteRuntime();

  return (
    <>
      {/* 01 — NAVBAR (Floating navigation bar with blur per B7) */}
      <Navbar />

      <main className="relative z-10 flex flex-col">
        {/* 02 — HERO SECTION (Above the fold: outcome headline, specificity, primary CTA with risk reversal, proof, visual) */}
        <HeroSection />

        {/* 03 — CREDIBILITY & CLIENT PROOF BAR */}
        <PartnersSection />

        {/* 04 — MANDATORY TAGLINE REVEAL (B11: Word-by-word scroll transition on base curve) */}
        <TaglineRevealSection />

        {/* 05 — CORE SERVICES & BENEFITS GRID (A2 Item 7) */}
        <ServicesSection />

        {/* 06 — PROBLEM TO SOLUTION (A2 Item 6) */}
        <SolutionsSection />

        {/* 07 — ABOUT WIZZO & WHY CHOOSE US */}
        <AboutSection />
        <WhyUsSection />

        {/* 08 — HOW IT WORKS / OUR PROCESS (A2 Item 8) */}
        <ProcessSection />

        {/* 09 — FEATURED PROJECTS & CASE STUDIES */}
        <ProjectsSection />

        {/* 10 — SOCIAL PROOF & TESTIMONIALS (A2 Item 9) */}
        <TestimonialsSection />

        {/* 12 — CAREERS AT WIZZO */}
        <CareersSection />

        {/* 13 — TECHNICAL INSIGHTS */}
        <InsightsSection />

        {/* 14 — FINAL CLOSING CTA WITH RISK REVERSAL & CONTACT FORM (A2 Item 11 & 12) */}
        <ContactSection config={config} />
      </main>

      {/* 15 — FOOTER */}
      <Footer config={config} />
    </>
  );
}
