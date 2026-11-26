"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle, MessageSquare, Clock } from "lucide-react";
import { submitContact } from "@/lib/actions/public";
import { site } from "@/lib/site";
import type { SiteRuntime } from "@/lib/settings";

const projectTypes = [
  "Custom Software Development",
  "Website Design & Development",
  "Web Application Development",
  "Business Automation",
  "API Development & Integration",
  "Technical Consulting & Architecture",
  "Software Maintenance & Support",
  "Careers & Talent Inquiry",
  "Other Project Inquiries",
];

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-3 outline-none transition-all focus:border-electric focus:ring-4 focus:ring-electric/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric [&>option]:bg-surface [&>option]:text-ink";

export function ContactSection({ config }: { config?: SiteRuntime | null }) {
  const email = config?.email || site.email;
  const phone = config?.phone || site.phone;

  const [state, action, pending] = useActionState(submitContact, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Closing CTA Block (A2 Item 11 & 12) */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-electric">
              <MessageSquare size={13} />
              Ready When You Are
            </span>
            <h2 className="heading-3 sm:heading-2 font-semibold tracking-tight text-ink [text-wrap:balance] mt-4">
              Ready to engineer dependable software for your business?
            </h2>
            <p className="mt-4 text-base text-ink-2 leading-relaxed [text-wrap:pretty]">
              Whether you are planning a modern web platform, looking to automate daily workflows,
              or seeking dependable engineering advisory, our team is ready to evaluate your goals and map out a clear technical blueprint.
            </p>
            <p className="mt-3 text-xs text-ink-3">
              Free 30 minute architecture consultation. No commitment required.
            </p>
          </div>
        </div>

        {/* Section 15: Contact Form & Channels Grid */}
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
          {/* Accessible Contact Form */}
          <div className="glass-card rounded-3xl p-7 md:p-10">
            <h3 className="font-display text-xl font-bold text-ink">
              Send a Direct Project Inquiry
            </h3>
            <p className="mt-1 text-xs text-ink-2 sm:text-sm">
              Fill out the details below. Our team reviews all inquiries promptly within one business day.
            </p>

            <form ref={formRef} action={action} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-ink mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Ashiqur Rahman"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-ink mb-1.5">
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-ink mb-1.5">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    placeholder="+880 1..."
                    className={inputCls}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-semibold text-ink mb-1.5">
                    Company / Organization (Optional)
                  </label>
                  <input
                    id="company"
                    name="company"
                    placeholder="e.g. Acme Corporation"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-xs font-semibold text-ink mb-1.5">
                  Project Type / Practice Area
                </label>
                <select id="service" name="service" className={inputCls} defaultValue="Custom Software Development">
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-ink mb-1.5">
                  Tell Us About Your Goals &amp; Timeline <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Describe what you want to build, existing systems, or questions you have..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Feedback messages */}
              {state && !state.ok && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.08] p-3 text-xs font-medium text-red-600 dark:text-red-400">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{state.error || "Submission failed. Please verify the information and try again."}</span>
                </div>
              )}

              {state?.ok && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] p-3.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Thank you! Your message has been received. Our engineering team will review it and reply within one business day.</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="btn-primary inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-electric px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-electric/25 transition-all hover:bg-electric-dark active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-electric focus-visible:ring-offset-bg disabled:opacity-60"
                >
                  {pending ? (
                    <span>Submitting inquiry...</span>
                  ) : (
                    <>
                      <span>Schedule Architecture Consultation</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Details & Office Channels */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-soft text-electric">
                    <Mail size={18} />
                  </span>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                      Email Inquiries
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="block font-display text-sm font-bold text-ink hover:text-electric transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-soft text-electric">
                    <Phone size={18} />
                  </span>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                      Phone &amp; WhatsApp
                    </span>
                    <a
                      href={`tel:${phone}`}
                      className="block font-display text-sm font-bold text-ink hover:text-electric transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              </div>

              {site.offices.map((office) => (
                <div key={office.label} className="glass-card rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-ink-2 shrink-0">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                        {office.label}
                      </span>
                      <h4 className="font-display text-sm font-bold text-ink">
                        {office.city}, {office.country}
                      </h4>
                      <p className="mt-1 text-xs text-ink-2">
                        {office.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-5 text-xs text-ink-2">
              <span className="font-semibold text-ink flex items-center gap-1.5 mb-1">
                <Clock size={13} className="text-electric" />
                Response Commitment
              </span>
              We treat all inquiries with strict confidentiality. All messages receive a technical evaluation within 24 hours.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
