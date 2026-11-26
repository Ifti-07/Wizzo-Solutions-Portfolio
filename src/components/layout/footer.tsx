import Link from "next/link";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { FacebookIcon, LinkedinIcon, XIcon, GithubIcon } from "@/components/ui/social-icons";
import { Logo } from "@/components/ui/logo";
import { site, coreServices } from "@/lib/site";
import type { SiteRuntime } from "@/lib/settings";

const navigationItems = [
  { label: "Home", href: "#hero" },
  { label: "About WIZZO", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Projects", href: "#projects" },
  { label: "Our Process", href: "#process" },
  { label: "Careers", href: "#careers" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

export function Footer({ config }: { config?: SiteRuntime | null }) {
  const email = config?.email || site.email;
  const phone = config?.phone || site.phone;

  return (
    <footer className="relative overflow-hidden border-t border-line bg-[#040814] text-white">
      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-12 md:px-8 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.1fr_1.1fr]">
          {/* Brand Column */}
          <div>
            <Link href="#hero" className="inline-block">
              {/* Uses official Secondary Logo with title (onDark variant) */}
              <Logo onDark />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              WIZZO Solutions is a corporate technology company delivering reliable custom software,
              modern web applications, and thoughtful business automation. Built with practical engineering
              and genuine human dedication.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={site.socials[0].href}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-white/70 transition-all hover:border-electric hover:bg-electric hover:text-white"
              >
                <LinkedinIcon size={16} />
              </a>
              <a
                href={site.socials[1].href}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-white/70 transition-all hover:border-electric hover:bg-electric hover:text-white"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href={site.socials[2].href}
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-white/70 transition-all hover:border-electric hover:bg-electric hover:text-white"
              >
                <XIcon size={16} />
              </a>
              <a
                href={site.socials[3].href}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-white/70 transition-all hover:border-electric hover:bg-electric hover:text-white"
              >
                <GithubIcon size={16} />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[#8ab8ff]">
              Navigation
            </h4>
            <ul className="mt-5 space-y-2.5">
              {navigationItems.slice(0, 6).map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[#8ab8ff]">
              Core Services
            </h4>
            <ul className="mt-5 space-y-2.5">
              {coreServices.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    href="#services"
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices & Contact */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[#8ab8ff]">
              Direct Contact
            </h4>
            <ul className="mt-5 space-y-3.5 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-electric" />
                <a href={`mailto:${email}`} className="transition-colors hover:text-white">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-electric" />
                <a href={`tel:${phone}`} className="transition-colors hover:text-white">
                  {phone}
                </a>
              </li>
              {site.offices.map((office) => (
                <li key={office.label} className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-electric" />
                  <div>
                    <span className="block text-xs font-semibold text-white/90">
                      {office.label} ({office.country})
                    </span>
                    <span className="text-xs text-white/60">{office.address}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar (B10: Privacy and Terms links in footer) */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#about" className="transition-colors hover:text-white">
              About WIZZO
            </a>
            <a href="#services" className="transition-colors hover:text-white">
              Services
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
            <span className="text-white/20">|</span>
            <Link href="#contact" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#contact" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
