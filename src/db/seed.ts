import "dotenv/config";

import { db } from "./index";
import {
  users,
  jobs,
  projects,
  partners,
  services,
  announcements,
  tasks,
  certificates,
} from "./schema";
import { servicesFallback } from "../lib/site";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding Wizzo Solutions database...");

  const existing = await db.select().from(users).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded — skipping.");
    process.exit(0);
  }

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  const [admin] = await db
    .insert(users)
    .values({
      name: "Wizzo Admin",
      email: "aurifti@gmail.com",
      passwordHash: hash("22501602wizzo"),
      role: "ADMIN",
      position: "System Administrator",
      department: "Management",
    })
    .returning();

  const [employee] = await db
    .insert(users)
    .values({
      name: "Demo Employee",
      email: "employee@wizzosolutions.com",
      passwordHash: hash("employee123"),
      role: "EMPLOYEE",
      position: "Software Engineer",
      department: "Engineering",
    })
    .returning();

  const [intern] = await db
    .insert(users)
    .values({
      name: "Demo Intern",
      email: "intern@wizzosolutions.com",
      passwordHash: hash("intern123"),
      role: "INTERN",
      position: "Web Development Intern",
      department: "Engineering",
      university: "University of Dhaka",
      mentorId: employee.id,
      program: "Wizzo Internship Program",
    })
    .returning();

  await db.insert(services).values(
    servicesFallback.map((s, i) => ({
      title: s.title,
      description: s.description,
      details: s.details,
      icon: s.icon,
      order: i,
      active: true,
    }))
  );

  const deadline = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await db.insert(jobs).values([
    {
      title: "Web Development Intern",
      type: "INTERNSHIP",
      category: "Engineering",
      location: "Dhaka, Bangladesh (Hybrid)",
      description:
        "Join our engineering team as a Web Development Intern. You will work on real client projects using React, Next.js and modern tooling while being mentored by senior engineers.",
      requirements:
        "• Currently enrolled in CSE/CS/EEE or a related department\n• Solid knowledge of HTML, CSS, JavaScript\n• Familiarity with React is a plus\n• Strong willingness to learn and collaborate",
      deadline,
    },
    {
      title: "UI/UX Design Intern",
      type: "INTERNSHIP",
      category: "Design",
      location: "Dhaka, Bangladesh (Hybrid)",
      description:
        "Work with our design team to craft beautiful, human-centered interfaces for web and mobile products. Learn design systems, prototyping and user research.",
      requirements:
        "• Portfolio demonstrating design fundamentals\n• Familiarity with Figma\n• Understanding of layout, typography and color\n• Currently enrolled in a relevant program",
      deadline,
    },
    {
      title: "Digital Marketing Intern",
      type: "INTERNSHIP",
      category: "Marketing",
      location: "Remote",
      description:
        "Support our marketing team on SEO, content and campaign execution for international clients.",
      requirements:
        "• Strong written English\n• Interest in SEO and analytics\n• Familiarity with social platforms\n• Currently enrolled in any discipline",
      deadline,
    },
    {
      title: "Software Engineer (Full-Time)",
      type: "FULL_TIME",
      category: "Engineering",
      location: "Dhaka, Bangladesh",
      description:
        "We are looking for a Software Engineer to design, build and scale web platforms for our international client base.",
      requirements:
        "• 2+ years of professional experience\n• Strong TypeScript, React/Next.js\n• Experience with PostgreSQL and REST APIs\n• Good communication skills",
      deadline,
    },
  ]);

  await db.insert(projects).values([
    {
      title: "NexCommerce Platform",
      category: "E-commerce",
      description:
        "A scalable multi-vendor e-commerce platform with real-time inventory, payments and analytics dashboards.",
      techStack: "Next.js, PostgreSQL, Stripe, Tailwind",
      liveUrl: "#",
      gradient: "from-[#0755F5] to-[#102542]",
      order: 1,
    },
    {
      title: "MediCare Connect",
      category: "Web",
      description:
        "Healthcare appointment and tele-consultation platform connecting clinics and patients across regions.",
      techStack: "React, Node.js, WebRTC, PostgreSQL",
      liveUrl: "#",
      gradient: "from-[#00B8D9] to-[#0755F5]",
      order: 2,
    },
    {
      title: "FleetIQ Logistics",
      category: "Software",
      description:
        "Fleet management system with live GPS tracking, route optimization and driver performance insights.",
      techStack: "Next.js, Go, Redis, Maps API",
      liveUrl: "#",
      gradient: "from-[#102542] to-[#3d78ff]",
      order: 3,
    },
    {
      title: "EduSphere LMS",
      category: "Web",
      description:
        "A modern learning management system with courses, quizzes, progress tracking and certificates.",
      techStack: "Next.js, Drizzle, PostgreSQL",
      liveUrl: "#",
      gradient: "from-[#7A5CFF] to-[#0755F5]",
      order: 4,
    },
    {
      title: "PayBridge Fintech",
      category: "Mobile",
      description:
        "Cross-platform mobile wallet with secure P2P transfers, QR payments and spending analytics.",
      techStack: "React Native, Node.js, PostgreSQL",
      liveUrl: "#",
      gradient: "from-[#0755F5] to-[#00E0A4]",
      order: 5,
    },
    {
      title: "Skyline Realty Portal",
      category: "Web",
      description:
        "Property marketplace with 3D tours, smart search and agent CRM integrations.",
      techStack: "Next.js, Three.js, PostgreSQL",
      liveUrl: "#",
      gradient: "from-[#FF7A59] to-[#0755F5]",
      order: 6,
    },
  ]);

  await db.insert(partners).values(
    [
      { name: "NovaTech", glyph: "N" },
      { name: "BluePeak", glyph: "B" },
      { name: "DataForge", glyph: "D" },
      { name: "CloudNine", glyph: "C" },
      { name: "HexaLab", glyph: "H" },
      { name: "Quantica", glyph: "Q" },
      { name: "SoftBridge", glyph: "S" },
      { name: "NexPixel", glyph: "NX" },
      { name: "UrbanByte", glyph: "U" },
      { name: "Skyline Digital", glyph: "SD" },
    ].map((p, i) => ({ ...p, order: i, active: true }))
  );

  await db.insert(announcements).values([
    {
      title: "Welcome to the Wizzo Team Portal",
      body: "This is your central hub for tasks, announcements, resources and certificates. Keep your profile up to date.",
      audience: "ALL",
    },
    {
      title: "Internship Cohort — Orientation",
      body: "Orientation for the new internship cohort will be held this week. Check your tasks and connect with your assigned mentor.",
      audience: "INTERNS",
    },
  ]);

  await db.insert(tasks).values([
    {
      title: "Review Q3 project roadmap",
      description: "Go through the client roadmap draft and add engineering estimates.",
      assigneeId: employee.id,
      status: "IN_PROGRESS",
    },
    {
      title: "Prepare sprint demo notes",
      description: "Summarize completed tickets for Friday's client demo.",
      assigneeId: employee.id,
      status: "TODO",
    },
    {
      title: "Complete React fundamentals module",
      description: "Finish the internal React learning track and submit your notes.",
      assigneeId: intern.id,
      status: "DONE",
    },
    {
      title: "Build your first Next.js page",
      description: "Create a responsive landing page following the Wizzo design system.",
      assigneeId: intern.id,
      status: "IN_PROGRESS",
    },
  ]);

  await db.insert(certificates).values({
    userId: intern.id,
    title: "Web Development Fundamentals",
    program: "Wizzo Internship Program",
    credentialId: `WZ-${String(intern.id).padStart(4, "0")}-2026`,
  });

  console.log("Seed complete.");
  console.log("  Admin:    aurifti@gmail.com / 22501602wizzo");
  console.log("  Employee: employee@wizzosolutions.com / employee123");
  console.log("  Intern:   intern@wizzosolutions.com / intern123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
