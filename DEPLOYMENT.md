# WIZZO Solutions — Production Deployment Guide

This guide provides end-to-end instructions for deploying the **WIZZO Solutions** corporate web platform.

---

## 1. Environment Variables Checklist

Before deploying, ensure you have configured these environment variables in your hosting provider's dashboard:

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | PostgreSQL connection URI (with SSL enabled for cloud DBs) | `postgresql://user:pass@ep-sample.us-east-1.neon.tech/neondb?sslmode=require` |
| `SESSION_SECRET` | **Yes** | 32+ char random string to sign JWT admin session cookies | Generate via `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Canonical live domain for OpenGraph, Twitter cards & sitemap | `https://wizzosolutions.com` |
| `NODE_ENV` | Yes | Target runtime environment | `production` |

---

## 2. Deployment Options

### Option A: Vercel + Neon / Supabase (Recommended)

Vercel provides native edge caching, instant deployments, and automatic HTTPS.

1. **Set Up a Free PostgreSQL Database:**
   * Create a free database at [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
   * Copy the Postgres connection string with pooled connection or direct connection.

2. **Deploy to Vercel:**
   * Push your repository to GitHub / GitLab.
   * Go to [vercel.com/new](https://vercel.com/new) and import your repository.
   * In the **Environment Variables** section, add:
     * `DATABASE_URL`
     * `SESSION_SECRET`
     * `NEXT_PUBLIC_SITE_URL`
   * Click **Deploy**.

3. **Initialize the Database Schema & Seed Data:**
   Once deployed, run this locally or in CI pointing to your production database:
   ```bash
   # Push schema tables and enums
   npm run db:push

   # Seed default administrator and content
   npm run db:seed
   ```

---

### Option B: Railway (Fastest Full-Stack Setup)

Railway can host both the Next.js app and the PostgreSQL database in a single project.

1. Go to [railway.app](https://railway.app) and create a **New Project**.
2. Add a **PostgreSQL** database service.
3. Add a **GitHub Repo** service connected to this repository.
4. In the Next.js service settings:
   * Link `DATABASE_URL` to `${{Postgres.DATABASE_URL}}`.
   * Add `SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL`.
5. Railway will automatically build and deploy the Next.js app.
6. Open the Railway web CLI or run locally with the Railway connection string:
   ```bash
   npm run db:push
   npm run db:seed
   ```

---

### Option C: Docker / Self-Hosted VPS (Ubuntu, DigitalOcean, Hetzner, AWS)

For self-hosted deployments using Docker Compose:

1. **Clone the repository on your server:**
   ```bash
   git clone <your-repo-url>
   cd wizzo-solutions-website-development
   ```

2. **Configure your production environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set your secure SESSION_SECRET and DATABASE_URL
   nano .env
   ```

3. **Build and launch with Docker Compose:**
   ```bash
   docker compose up -d --build
   ```

4. **Initialize the database inside the container:**
   ```bash
   docker compose exec web npm run db:push
   docker compose exec web npm run db:seed
   ```

5. **Configure Nginx / Caddy Reverse Proxy with SSL (Port 3000):**
   ```nginx
   server {
       server_name wizzosolutions.com www.wizzosolutions.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

---

## 3. Post-Deployment Verification

After deployment, verify that all systems are operational:

1. **Health Check Endpoint:**
   Visit: `https://your-domain.com/api/health`
   Expected response:
   ```json
   {
     "ok": true,
     "status": "healthy",
     "timestamp": "2026-11-26T...",
     "database": "connected",
     "env": "production"
   }
   ```

2. **Robots & Sitemap:**
   * Visit `https://your-domain.com/robots.txt`
   * Visit `https://your-domain.com/sitemap.xml`

3. **Admin Dashboard Access:**
   * Visit `https://your-domain.com/login` or `https://your-domain.com/admin/login`
   * Default seeded credentials (change immediately in Admin > Users):
     * **Email:** `aurifti@gmail.com`
     * **Password:** `22501602wizzo`

4. **Lead & Contact Forms:**
   * Submit a test consultation inquiry from the Home page.
   * Verify the inquiry appears in the Admin messages dashboard.

5. **Careers & Application Flow:**
   * Visit `https://your-domain.com/careers`
   * Submit a test application with an attached PDF CV.
   * Verify the submission and resume attachment in the Admin panel.
