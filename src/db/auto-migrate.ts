import "server-only";
import { pool } from "./index";

let initPromise: Promise<void> | null = null;

export async function ensureDatabaseSchema(): Promise<void> {
  if (!pool) return;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const client = await pool.connect();
        try {
          // Check if contacts table exists
          const check = await client.query(
            "SELECT to_regclass('public.contacts') as reg;"
          );
          if (check.rows[0]?.reg) {
            return;
          }

          // Tables don't exist yet, run initial DDL migration
          await client.query(`
            DO $$ BEGIN
              CREATE TYPE role AS ENUM ('ADMIN', 'EMPLOYEE', 'INTERN');
            EXCEPTION WHEN duplicate_object THEN null;
            END $$;

            DO $$ BEGIN
              CREATE TYPE job_type AS ENUM ('INTERNSHIP', 'FULL_TIME');
            EXCEPTION WHEN duplicate_object THEN null;
            END $$;

            DO $$ BEGIN
              CREATE TYPE application_status AS ENUM ('PENDING', 'REVIEWED', 'SHORTLISTED', 'APPROVED', 'REJECTED');
            EXCEPTION WHEN duplicate_object THEN null;
            END $$;

            DO $$ BEGIN
              CREATE TYPE audience AS ENUM ('ALL', 'EMPLOYEES', 'INTERNS');
            EXCEPTION WHEN duplicate_object THEN null;
            END $$;

            CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE,
              password_hash TEXT NOT NULL,
              role role NOT NULL DEFAULT 'EMPLOYEE',
              phone TEXT,
              position TEXT,
              department TEXT,
              university TEXT,
              mentor_id INTEGER,
              program TEXT,
              status TEXT NOT NULL DEFAULT 'ACTIVE',
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

            CREATE TABLE IF NOT EXISTS jobs (
              id SERIAL PRIMARY KEY,
              title TEXT NOT NULL,
              type job_type NOT NULL DEFAULT 'INTERNSHIP',
              category TEXT NOT NULL DEFAULT 'Engineering',
              location TEXT NOT NULL DEFAULT 'Dhaka, Bangladesh',
              description TEXT NOT NULL,
              requirements TEXT NOT NULL,
              deadline TIMESTAMPTZ,
              open BOOLEAN NOT NULL DEFAULT true,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS applications (
              id SERIAL PRIMARY KEY,
              job_id INTEGER,
              full_name TEXT NOT NULL,
              email TEXT NOT NULL,
              phone TEXT NOT NULL,
              university TEXT,
              department TEXT,
              education_level TEXT,
              position TEXT NOT NULL,
              skills TEXT,
              portfolio_url TEXT,
              cv_path TEXT,
              message TEXT,
              status application_status NOT NULL DEFAULT 'PENDING',
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);

            CREATE TABLE IF NOT EXISTS projects (
              id SERIAL PRIMARY KEY,
              title TEXT NOT NULL,
              category TEXT NOT NULL DEFAULT 'Web',
              description TEXT NOT NULL,
              tech_stack TEXT NOT NULL DEFAULT '',
              live_url TEXT,
              gradient TEXT NOT NULL DEFAULT 'from-[#0755F5] to-[#102542]',
              "order" INTEGER NOT NULL DEFAULT 0,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS partners (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              glyph TEXT NOT NULL DEFAULT '◆',
              website_url TEXT,
              "order" INTEGER NOT NULL DEFAULT 0,
              active BOOLEAN NOT NULL DEFAULT true
            );

            CREATE TABLE IF NOT EXISTS services (
              id SERIAL PRIMARY KEY,
              title TEXT NOT NULL,
              description TEXT NOT NULL,
              details TEXT NOT NULL DEFAULT '',
              icon TEXT NOT NULL DEFAULT 'Code2',
              "order" INTEGER NOT NULL DEFAULT 0,
              active BOOLEAN NOT NULL DEFAULT true
            );

            CREATE TABLE IF NOT EXISTS contacts (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              email TEXT NOT NULL,
              phone TEXT,
              company TEXT,
              service TEXT,
              message TEXT NOT NULL,
              read BOOLEAN NOT NULL DEFAULT false,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS announcements (
              id SERIAL PRIMARY KEY,
              title TEXT NOT NULL,
              body TEXT NOT NULL,
              audience audience NOT NULL DEFAULT 'ALL',
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS certificates (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL,
              title TEXT NOT NULL,
              program TEXT,
              credential_id TEXT,
              issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS settings (
              key TEXT PRIMARY KEY,
              value TEXT NOT NULL DEFAULT ''
            );

            CREATE TABLE IF NOT EXISTS audit_logs (
              id SERIAL PRIMARY KEY,
              user_id INTEGER,
              action TEXT NOT NULL,
              details TEXT NOT NULL DEFAULT '',
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            INSERT INTO users (name, email, password_hash, role, position, department)
            VALUES ('Wizzo Admin', 'aurifti@gmail.com', '$2b$10$DkGm4ri/DPFcI4rCkYZmQOD5qIO4jcwp/eZNqVio7nQylKjsOm8Gi', 'ADMIN', 'System Administrator', 'Management')
            ON CONFLICT (email) DO NOTHING;
          `);
        } finally {
          client.release();
        }
      } catch (err) {
        console.warn("Auto-migration check notice:", err);
      }
    })();
  }
  return initPromise;
}
