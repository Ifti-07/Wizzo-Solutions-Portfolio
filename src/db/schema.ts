import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "EMPLOYEE", "INTERN"]);
export const jobTypeEnum = pgEnum("job_type", ["INTERNSHIP", "FULL_TIME"]);
export const appStatusEnum = pgEnum("application_status", [
  "PENDING",
  "REVIEWED",
  "SHORTLISTED",
  "APPROVED",
  "REJECTED",
]);
export const audienceEnum = pgEnum("audience", ["ALL", "EMPLOYEES", "INTERNS"]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("EMPLOYEE"),
    phone: text("phone"),
    position: text("position"),
    department: text("department"),
    university: text("university"),
    mentorId: integer("mentor_id"),
    program: text("program"), // internship program name
    status: text("status").notNull().default("ACTIVE"), // ACTIVE | DISABLED
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("users_role_idx").on(t.role)]
);

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: jobTypeEnum("type").notNull().default("INTERNSHIP"),
  category: text("category").notNull().default("Engineering"),
  location: text("location").notNull().default("Dhaka, Bangladesh"),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  deadline: timestamp("deadline", { withTimezone: true }),
  open: boolean("open").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id"),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    university: text("university"),
    department: text("department"),
    educationLevel: text("education_level"),
    position: text("position").notNull(),
    skills: text("skills"),
    portfolioUrl: text("portfolio_url"),
    cvPath: text("cv_path"),
    message: text("message"),
    status: appStatusEnum("status").notNull().default("PENDING"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("applications_status_idx").on(t.status)]
);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull().default("Web"),
  description: text("description").notNull(),
  techStack: text("tech_stack").notNull().default(""),
  liveUrl: text("live_url"),
  gradient: text("gradient").notNull().default("from-[#0755F5] to-[#102542]"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  glyph: text("glyph").notNull().default("◆"),
  websiteUrl: text("website_url"),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  details: text("details").notNull().default(""),
  icon: text("icon").notNull().default("Code2"),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  service: text("service"),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  audience: audienceEnum("audience").notNull().default("ALL"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  program: text("program"),
  credentialId: text("credential_id"),
  issueDate: timestamp("issue_date", { withTimezone: true }).notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: text("action").notNull(),
  details: text("details").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Partner = typeof partners.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
