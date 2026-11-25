# Wizzo Solutions — Premium Corporate Website & Digital Portal

A complete, production-ready corporate platform for **Wizzo Solutions** built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP-style easing, Lenis smooth scrolling, PostgreSQL and Drizzle ORM.

## Features

### Public Website
- Immersive hero with animated word-reveal headline, aurora gradients, grid backdrop and animated counters
- About, Services (12 services with "Learn More" modals), filterable Projects portfolio
- Infinite dual-direction partner logo marquee (grayscale → color on hover)
- "Why Choose Wizzo", animated Global Presence visualization ("From Asia to the World")
- Contact section with validated form (submissions stored in DB)
- Careers page with job/internship listings and full application system (CV upload)
- Light / Night mode with an animated toggle — persisted across visits
- Scroll progress indicator, Lenis smooth scrolling, scroll-triggered reveals, parallax
- SEO: metadata, Open Graph, `sitemap.xml`, `robots.txt`, semantic HTML

### Portals (real backend, role-based)
- **Employee & Intern login** → `/login`
- **Admin login** → `/admin/login`
- Employee dashboard: profile, tasks with status updates, announcements, certificates, password change
- Intern dashboard: mentor info, learning progress, internship status, certificates
- Admin dashboard (`/admin`): overview stats, team & intern management (roles, mentors, password resets, announcements, certificates), job application pipeline (filter / shortlist / approve / reject / download CVs), job openings CRUD, website content CMS (services, projects, partners), task assignment, contact messages, website settings, audit log

## Default Accounts (seeded)

| Role     | Email                       | Password        |
|----------|-----------------------------|-----------------|
| Admin    | `admin@wizzosolutions.com`    | `admin123456`   |
| Employee | `employee@wizzosolutions.com` | `employee123`   |
| Intern   | `intern@wizzosolutions.com`   | `intern123`     |

> Change these immediately in production. Users cannot self-register as administrators; all accounts are created via the Admin panel.

## Tech Stack

- **Next.js 16** App Router + TypeScript, Server Components by default
- **Tailwind CSS 4** with a custom dual-theme token system
- **Framer Motion** + **Lenis** for motion & smooth scrolling
- **PostgreSQL** + **Drizzle ORM**
- Auth: email/password (bcrypt) + signed JWT session in httpOnly cookie (jose)
- CV uploads stored in `uploads/cv/`, served to admins via `/api/cv/[id]`

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    → set DATABASE_URL and a long random SESSION_SECRET

# 3. Push schema & seed
npx drizzle-kit push
npx tsx src/db/seed.ts

# 4. Run
npm run dev        # development
npm run build && npm run start   # production
```

## Deployment (Vercel + hosted Postgres)

1. Create a PostgreSQL database (Supabase, Neon, Railway…).
2. Set environment variables: `DATABASE_URL`, `SESSION_SECRET` (long random string).
3. Deploy to Vercel — build command `npm run build`.
4. Run `npx drizzle-kit push` + `npx tsx src/db/seed.ts` against the production database once.

> **Note on file uploads:** runtime uploads under `uploads/` are ephemeral on serverless platforms.
> For production on Vercel, swap `uploads/cv` storage in `src/lib/actions/public.ts` for object
> storage (e.g. Cloudinary or S3) — the data model already stores a path reference.

## Project Structure

```
src/
  app/                 # routes: /, /careers, /login, /admin/login, /dashboard, /admin/*
  components/
    layout/            # navbar, footer, smooth scroll, scroll progress
    sections/          # hero, about, services, projects, partners, why-us, global, contact
    admin/             # admin shell + management UIs
    dashboard/         # employee/intern dashboard
    careers/           # jobs list + application form
    ui/                # logo, theme toggle, reveals, counters, social icons
  lib/
    auth.ts            # sessions, hashing, role guards, audit logging
    actions/           # server actions (public, auth, dashboard, admin)
    site.ts            # central configurable brand/site constants
    settings.ts        # runtime settings loader (admin-editable)
  db/
    schema.ts          # Drizzle schema
    seed.ts            # idempotent seed script
```

## Content Management

Almost everything is editable without code changes from the Admin panel:
services, projects, partners, job openings, announcements, certificates, users, settings.
Brand statistics and the global-presence country list live in `src/lib/site.ts`.
