"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MailOpen,
  Mail,
  Building2,
  Phone,
  Reply,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { adminMarkContact, adminDeleteContact } from "@/lib/actions/admin";
import { Card, Badge, DeleteBtn } from "./ui";
import { cn, formatDate } from "@/lib/utils";

type ContactRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesAdmin({ contacts }: { contacts: ContactRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [search, setSearch] = useState("");

  const unreadCount = useMemo(() => contacts.filter((c) => !c.read).length, [contacts]);
  const readCount = useMemo(() => contacts.filter((c) => c.read).length, [contacts]);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      if (filter === "UNREAD" && c.read) return false;
      if (filter === "READ" && !c.read) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.service && c.service.toLowerCase().includes(q)) ||
        c.message.toLowerCase().includes(q)
      );
    });
  }, [contacts, filter, search]);

  const handleToggleRead = async (id: number, currentRead: boolean) => {
    await adminMarkContact(id, !currentRead);
    router.refresh();
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Inquiries & Client Messages
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-electric/15 px-3 py-0.5 text-xs font-bold text-electric">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-2">
            Manage project requests, business proposals, and consultation inquiries from the website.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl border border-line bg-surface p-1">
          <button
            onClick={() => setFilter("ALL")}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === "ALL" ? "bg-electric text-white shadow-sm" : "text-ink-2 hover:text-ink"
            )}
          >
            All Inquiries ({contacts.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === "UNREAD" ? "bg-electric text-white shadow-sm" : "text-ink-2 hover:text-ink"
            )}
          >
            Unread
            {unreadCount > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px]",
                  filter === "UNREAD" ? "bg-white text-electric font-bold" : "bg-electric text-white"
                )}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("READ")}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === "READ" ? "bg-electric text-white shadow-sm" : "text-ink-2 hover:text-ink"
            )}
          >
            Read ({readCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] max-w-sm flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-xs text-ink placeholder:text-ink-3 outline-none transition-all focus:border-electric focus:ring-2 focus:ring-electric/15"
          />
        </div>
      </div>

      {/* Inquiries List */}
      <div className="mt-6 space-y-3.5">
        {filtered.length === 0 ? (
          <Card className="py-16 text-center">
            <Mail className="mx-auto h-10 w-10 text-ink-3/40" />
            <p className="mt-3 font-semibold text-ink">No inquiries found</p>
            <p className="mt-1 text-xs text-ink-3">
              {contacts.length === 0
                ? "Client messages submitted through the website contact form will appear here."
                : "No inquiries matched your current filter or search criteria."}
            </p>
          </Card>
        ) : (
          filtered.map((c) => (
            <Card
              key={c.id}
              className={cn(
                "!p-5 transition-all hover:border-electric/30",
                !c.read
                  ? "border-l-4 border-l-electric bg-electric/[0.02] dark:bg-electric/[0.03]"
                  : "border-line opacity-95"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                      c.read
                        ? "bg-mist text-ink-3 dark:bg-surface-2"
                        : "bg-electric text-white shadow-sm"
                    )}
                  >
                    {c.read ? <MailOpen size={17} /> : <Mail size={17} />}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink text-base">{c.name}</p>
                      {!c.read && <Badge tone="blue">NEW INQUIRY</Badge>}
                      {c.service && (
                        <span className="rounded-md border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-ink-2">
                          {c.service}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
                      <a
                        href={`mailto:${c.email}`}
                        className="inline-flex items-center gap-1.5 text-electric hover:underline"
                      >
                        <Mail size={13} /> {c.email}
                      </a>
                      {c.phone && (
                        <a
                          href={`tel:${c.phone}`}
                          className="inline-flex items-center gap-1.5 text-ink-2 hover:text-ink hover:underline"
                        >
                          <Phone size={13} /> {c.phone}
                        </a>
                      )}
                      {c.company && (
                        <span className="inline-flex items-center gap-1.5 text-ink-3">
                          <Building2 size={13} /> {c.company}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-ink-3">
                    {formatDate(c.createdAt)}
                  </span>

                  {/* Reply Button */}
                  <a
                    href={`mailto:${c.email}?subject=${encodeURIComponent(
                      `Re: Your Inquiry with Wizzo Solutions (${c.service || "Project Consultation"})`
                    )}&body=${encodeURIComponent(
                      `Hi ${c.name},\n\nThank you for reaching out to Wizzo Solutions regarding "${c.service || "your project"}".\n\n`
                    )}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-electric hover:text-electric hover:bg-electric/5"
                  >
                    <Reply size={13} /> Reply
                  </a>

                  {/* Mark Read/Unread */}
                  <button
                    onClick={() => handleToggleRead(c.id, c.read)}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-electric hover:text-electric"
                  >
                    Mark {c.read ? "Unread" : "Read"}
                  </button>

                  <DeleteBtn small onDelete={() => adminDeleteContact(c.id)} />
                </div>
              </div>

              {/* Message Content */}
              <div className="mt-4 rounded-xl border border-line/60 bg-surface-2/60 p-4 text-sm leading-relaxed text-ink dark:bg-surface-2/30">
                <p className="whitespace-pre-line text-ink-2">{c.message}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
