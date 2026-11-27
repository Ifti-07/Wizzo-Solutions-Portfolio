/**
 * WIZZO Solutions — Central Brand Configuration & Authentic Company Data
 * Human-centered corporate technology brand identity.
 */

export interface OfficeLocation {
  label: string;
  city: string;
  country: string;
  address: string;
  role: string;
  isPrimary?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  businessValue: string;
  deliverables: string[];
}

export interface SolutionItem {
  id: string;
  title: string;
  problem: string;
  solution: string;
  businessOutcome: string;
  iconName: string;
  typicalTech: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  type: string;
  overview: string;
  capabilities: string[];
  techStack: string[];
  image: string;
}

export interface ProcessStage {
  step: string;
  title: string;
  tagline: string;
  description: string;
  keyOutputs: string[];
  iconName?: string;
}

export interface InternshipTrack {
  id: string;
  title: string;
  category: "Engineering" | "Design" | "Infrastructure" | "Business";
  duration: string;
  commitment: string;
  description: string;
  skillsGained: string[];
  iconName?: string;
}

export interface InsightArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  publishedDate: string;
  excerpt: string;
  author: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  industry: string;
  projectContext: string;
  quote: string;
}

export const site = {
  name: "WIZZO Solutions",
  legalName: "WIZZO Solutions Limited",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://wizzo.solutions").replace(/\/$/, ""),
  tagline: "Practical Technology Solutions for Growing Businesses",
  heroHeadline: "We build reliable software, websites, and digital systems that move your business forward.",
  heroSubtitle:
    "WIZZO Solutions is a corporate technology company delivering custom software engineering, modern web applications, and thoughtful business automation. Built with human craftsmanship, global delivery standards, and genuine business focus.",
  aboutStory:
    "WIZZO Solutions was established with a clear mission: to cut through unnecessary technical complexity and deliver reliable, high-value digital solutions for real businesses. Originating with roots in China and expanding operations across Asia with an active engineering and delivery hub in Dhaka, Bangladesh, we unite international engineering standards with transparent, collaborative teamwork.",
  email: "info@wizzosolutions.com",
  phone: "+880 1832-348270", // Official contact
  offices: [
    {
      label: "Operations & Delivery Hub",
      city: "Dhaka",
      country: "Bangladesh",
      address: "Dhaka, Bangladesh",
      role: "Engineering, Design & Project Delivery",
      isPrimary: true,
    },
    {
      label: "International Office",
      city: "Guangzhou",
      country: "China",
      address: "Guangzhou / Hong Kong Region, China",
      role: "Strategic Partnerships & Regional Coordination",
      isPrimary: false,
    },
  ] as OfficeLocation[],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/wizzo-solutions" },
    { label: "Facebook", href: "https://www.facebook.com/wizzosolutions" },
    { label: "X (Twitter)", href: "https://x.com/wizzosolutions" },
    { label: "GitHub", href: "https://github.com/wizzo-solutions" },
  ],
  presence: [
    { country: "China", role: "Origin & International Office", x: 71, y: 40 },
    { country: "Bangladesh", role: "Operations & Delivery Hub", x: 66.5, y: 51 },
  ],
};

/**
 * The 8 Core Services of WIZZO Solutions
 */
export const coreServices: ServiceItem[] = [
  {
    id: "custom-software",
    title: "Custom Software Development",
    shortDescription: "Tailored business software architected to eliminate manual bottlenecks and scale with your workflows.",
    fullDescription:
      "We build bespoke software applications engineered specifically around your company's proprietary processes. From internal tools to complex operational backends, we prioritize code longevity, clean architectures, and intuitive user experiences.",
    iconName: "Code2",
    businessValue: "Eliminates reliance on rigid off-the-shelf software and automates operational overhead.",
    deliverables: ["Custom CRM/ERP Systems", "Data Processing Engines", "Role-Based Internal Tools", "Legacy Software Modernization"],
  },
  {
    id: "website-design-dev",
    title: "Website Design & Development",
    shortDescription: "Performance-oriented corporate websites designed with editorial precision, sub-second loads, and high conversion.",
    fullDescription:
      "Your website is often the primary touchpoint for prospective clients and partners. We create modern, responsive websites built with Next.js, featuring refined typography, thoughtful accessibility, and robust search engine performance.",
    iconName: "Globe",
    businessValue: "Elevates brand credibility, ranks higher on search engines, and converts visitors into qualified inquiries.",
    deliverables: ["Corporate Websites", "Product Landing Pages", "Editorial Portals", "Responsive Mobile-First UI/UX"],
  },
  {
    id: "web-app-dev",
    title: "Web Application Development",
    shortDescription: "Interactive, high-performing web apps and SaaS products that deliver desktop-grade reliability in the browser.",
    fullDescription:
      "We design and build dynamic web applications that handle complex data, secure user flows, and real-time state management. Utilizing modern full-stack architectures, our web apps load fast, maintain high uptime, and stay easy to maintain.",
    iconName: "AppWindow",
    businessValue: "Provides customers and teams with accessible, real-time digital services from any modern device.",
    deliverables: ["Multi-Tenant SaaS Apps", "Customer Portals", "Interactive Dashboards", "Cloud Business Tools"],
  },
  {
    id: "business-automation",
    title: "Business Automation",
    shortDescription: "Connecting fragmented systems to automate repetitive operations, eliminate human error, and save hours.",
    fullDescription:
      "Repetitive copy-pasting, disconnected spreadsheets, and manual email notifications drain team productivity. We design automated workflows that seamlessly pass information between your inventory, accounting, CRM, and communications channels.",
    iconName: "Workflow",
    businessValue: "Saves hundreds of human hours monthly and dramatically cuts costly operational mistakes.",
    deliverables: ["Workflow Orchestration", "ERP/CRM Data Sync", "Automated Notifications & Reports", "Paperless Business Pipelines"],
  },
  {
    id: "api-integration",
    title: "API Development & Integration",
    shortDescription: "Secure, well-documented REST & GraphQL interfaces connecting your applications with third-party ecosystems.",
    fullDescription:
      "Modern technology depends on reliable connectivity. We develop robust APIs and build secure integrations with payment gateways, banking channels, logistics providers, and external software suites with comprehensive telemetry.",
    iconName: "Webhook",
    businessValue: "Enables fast interoperability between modern customer interfaces and complex backends.",
    deliverables: ["RESTful & GraphQL APIs", "Payment Gateway Integrations", "Webhook Handlers", "Third-Party Microservices"],
  },
  {
    id: "digital-solutions",
    title: "Digital Solutions & Strategy",
    shortDescription: "End-to-end digital transformation roadmaps helping traditional businesses modernize their technology landscape.",
    fullDescription:
      "Navigating technology transitions requires more than just writing code; it demands a clear understanding of commercial objectives. We guide organizations through cloud adoption, digital workplace setup, and customer-facing technology roadmaps.",
    iconName: "Compass",
    businessValue: "Provides leadership with clarity and minimizes expensive technology missteps.",
    deliverables: ["Digital Modernization Roadmaps", "Commerce Architecture", "Cloud Migration Planning", "Data Infrastructure Setup"],
  },
  {
    id: "technical-consulting",
    title: "Technical Consulting",
    shortDescription: "Objective engineering guidance on software architecture, code reviews, security standards, and technology selection.",
    fullDescription:
      "Whether evaluating a new technology stack, preparing for scale, or auditing an existing codebase for vulnerabilities and technical debt, our senior engineers provide pragmatic, battle-tested counsel.",
    iconName: "Lightbulb",
    businessValue: "Prevents technical dead ends and ensures your technology investments stand the test of time.",
    deliverables: ["Architecture Audits", "Codebase Health Reviews", "Security & Compliance Audits", "Tech Stack Feasibility Studies"],
  },
  {
    id: "software-support",
    title: "Software Maintenance & Support",
    shortDescription: "Proactive monitoring, regular security patching, and ongoing performance enhancements for continuous peace of mind.",
    fullDescription:
      "Software requires continuous care to maintain security and speed. We offer structured maintenance agreements including uptime monitoring, framework upgrades, backup management, and responsive bug fixing.",
    iconName: "ShieldCheck",
    businessValue: "Ensures business continuity, safeguards customer data, and keeps software performing at its peak.",
    deliverables: ["24/7 Uptime Monitoring", "Security Vulnerability Patching", "Database Optimizations", "Service Level Agreements (SLA)"],
  },
];

/** Fallback services for database seeding if used */
export const servicesFallback = coreServices.map((s) => ({
  icon: s.iconName,
  title: s.title,
  description: s.shortDescription,
  details: s.fullDescription,
}));

/**
 * Practical Business Solutions (Problem → Outcome Mapping)
 */
export const solutionsList: SolutionItem[] = [
  {
    id: "business-websites",
    title: "High-Performance Business Websites",
    problem: "Outdated, sluggish websites that fail on mobile devices and do not represent the true caliber of the company.",
    solution: "Custom Next.js engineering with bespoke typography, sub-second loading, and clear conversion pathways.",
    businessOutcome: "Strengthens corporate reputation, increases organic inbound leads, and guarantees mobile responsiveness.",
    iconName: "Layout",
    typicalTech: ["Next.js", "TypeScript", "Tailwind CSS", "Semantic SEO"],
  },
  {
    id: "web-apps",
    title: "Custom Web Applications",
    problem: "Commercial off-the-shelf software that forces businesses into rigid workflows and expensive per-seat licenses.",
    solution: "Purpose-built web applications that mirror your exact business operations without unnecessary bloat.",
    businessOutcome: "Full operational control, streamlined employee workflows, and zero per-seat licensing penalties.",
    iconName: "Layers",
    typicalTech: ["React", "PostgreSQL", "Node.js", "Cloud Hosting"],
  },
  {
    id: "workflow-automation",
    title: "Operational Workflow Automation",
    problem: "Hours wasted every week manually transferring customer orders, status updates, and reports across platforms.",
    solution: "Automated event-driven data pipelines that immediately synchronize systems whenever updates occur.",
    businessOutcome: "Cuts routine administrative work by up to 70% and completely eliminates data entry errors.",
    iconName: "Workflow",
    typicalTech: ["Webhooks", "REST APIs", "Node.js", "Task Queues"],
  },
  {
    id: "digital-business-systems",
    title: "Integrated Digital Business Systems",
    problem: "Siloed inventory, sales, and client communications causing delays and confusion between departments.",
    solution: "Unified database architecture connecting inventory, order processing, and customer relationship management.",
    businessOutcome: "Single source of company truth with real-time operational visibility across all branches.",
    iconName: "Database",
    typicalTech: ["PostgreSQL", "Drizzle ORM", "Next.js", "Tailwind"],
  },
  {
    id: "api-system-integration",
    title: "API & Payment Gateway Integration",
    problem: "Inability to accept modern digital payments or integrate with local shipping and international services.",
    solution: "Hardened API integrations for regional payment gateways, SMS notifications, and courier webhooks.",
    businessOutcome: "Smooth automated checkout experiences and immediate payment confirmations.",
    iconName: "CreditCard",
    typicalTech: ["Stripe", "Local Gateways", "REST", "Secure Webhooks"],
  },
  {
    id: "custom-software",
    title: "Enterprise Custom Software",
    problem: "Complex proprietary processes that cannot be handled by standard commercial templates.",
    solution: "Clean-slate architectural design with robust permissions, audit trails, and modular expandability.",
    businessOutcome: "A proprietary technological competitive advantage that grows with your business.",
    iconName: "Boxes",
    typicalTech: ["TypeScript", "PostgreSQL", "Redis", "Docker"],
  },
];

/**
 * Why Choose WIZZO Solutions
 */
export const whyChooseReasons = [
  {
    number: "01",
    title: "Business-Focused Thinking",
    description:
      "We don't write code for the sake of technology alone. Every architectural decision is rooted in your company's actual commercial goals, operational efficiency, and measurable return.",
    icon: "Target",
  },
  {
    number: "02",
    title: "Practical, Reliable Stacks",
    description:
      "We avoid fleeting industry fads. We build with mature, battle-tested technologies like Next.js, TypeScript, and PostgreSQL that ensure stability, easy hiring, and decades of maintainability.",
    icon: "Layers",
  },
  {
    number: "03",
    title: "Transparent & Honest Communication",
    description:
      "No corporate jargon, no hidden fees, and no exaggerated claims. You receive direct access to the engineers and designers building your project with clear weekly milestones.",
    icon: "MessageSquare",
  },
  {
    number: "04",
    title: "Human-Centered Craftsmanship",
    description:
      "We treat every user interface with care. We craft layouts with thoughtful visual hierarchy, clear typography, and subtle interactions that feel natural and respectful of user time.",
    icon: "Heart",
  },
  {
    number: "05",
    title: "International Standards, Local Dedication",
    description:
      "Combining global project delivery experience from China and Asia with an accessible, dedicated operations hub in Dhaka, Bangladesh for close collaboration and high responsiveness.",
    icon: "Globe",
  },
  {
    number: "06",
    title: "Reliable Long-Term Partnership",
    description:
      "Our engagement doesn't end at delivery. We stay beside our clients to provide continuous monitoring, performance tuning, and technical guidance as their business expands.",
    icon: "Handshake",
  },
];

/**
 * The 6-Stage WIZZO Development Workflow
 */
export const developmentProcess: ProcessStage[] = [
  {
    step: "01",
    title: "Discover",
    tagline: "Uncovering Requirements & Context",
    description:
      "We begin by thoroughly understanding your business objectives, operational workflows, target audience, and current technical challenges. We ask the right questions before writing a single line of code.",
    keyOutputs: ["Requirements Document", "Technical Feasibility Assessment", "Project Roadmap & Milestones"],
    iconName: "Search",
  },
  {
    step: "02",
    title: "Plan",
    tagline: "Architecture & Blueprinting",
    description:
      "We define the technical blueprint, selecting the ideal tech stack, designing database schemas, establishing security protocols, and outlining precise scope and deliverables.",
    keyOutputs: ["Architecture Blueprint", "Data Schema Specification", "Scope of Work & Sprint Schedule"],
    iconName: "FileText",
  },
  {
    step: "03",
    title: "Design",
    tagline: "Intuitive & Human Experience",
    description:
      "We craft responsive, accessible interfaces focused on clarity, visual hierarchy, and brand personality. We build interactive prototypes so you can experience the product before development begins.",
    keyOutputs: ["Interactive Prototypes", "Design System & Tokens", "Responsive Layout Specs"],
    iconName: "Palette",
  },
  {
    step: "04",
    title: "Develop",
    tagline: "Clean, Modern Engineering",
    description:
      "Our engineers build your software following strict code standards, typed contracts, modular architecture, and version control. You receive regular build previews to track real progress.",
    keyOutputs: ["Production-Quality Codebase", "API Documentation", "Staging Environment Previews"],
    iconName: "Code2",
  },
  {
    step: "05",
    title: "Test & Refine",
    tagline: "Rigorous Quality Assurance",
    description:
      "We rigorously validate the solution across browsers, operating systems, and device form factors. We test edge cases, benchmark loading speeds, inspect security headers, and refine subtle details.",
    keyOutputs: ["Cross-Device QA Reports", "Performance Benchmark Audit", "Security & Accessibility Check"],
    iconName: "CheckCheck",
  },
  {
    step: "06",
    title: "Deliver & Support",
    tagline: "Smooth Deployment & Continuity",
    description:
      "We manage the production launch with zero downtime, conduct handover walk-throughs with your team, and provide reliable post-launch monitoring and technical support as agreed.",
    keyOutputs: ["Production Deployment", "Handover Documentation", "Continuous SLA Maintenance"],
    iconName: "Rocket",
  },
];

/**
 * Featured Genuine Projects Showcase
 */
export const featuredProjects: ProjectItem[] = [
  {
    id: "iubat-readit",
    title: "IUBAT ReadIt",
    category: "Academic Community Platform",
    type: "Full-stack web application",
    overview:
      "A Reddit-inspired academic community platform for university students and faculty. It brings course-based communities, academic resources, and interactive discussions into one centralized environment.",
    capabilities: [
      "Course-based communities and feeds",
      "Academic notes and resource sharing",
      "Threaded discussions and comments",
      "Voting and bookmarking",
      "Notifications",
      "Content reporting and moderation",
      "Administrative dashboard",
    ],
    techStack: [
      "ASP.NET Core 10 MVC",
      "C#",
      "Entity Framework Core",
      "SQLite",
      "ASP.NET Core Identity",
      "Razor Views",
      "JavaScript",
      "CSS3",
      "Bootstrap Icons",
    ],
    image: "/api/project-asset/StudyHub.jpeg",
  },
  {
    id: "cashn-style",
    title: "Cash'N Style",
    category: "Fashion E-commerce",
    type: "Full-stack web application",
    overview:
      "A fashion-focused e-commerce platform built to deliver a modern online shopping experience through a responsive storefront, backend API services, and database integration.",
    capabilities: [
      "Product and category management",
      "Responsive storefront",
      "Backend API integration",
      "Database-driven application structure",
      "Authentication-related API functionality",
    ],
    techStack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Mongoose", "TypeScript"],
    image: "/api/project-asset/E-commerce.jpeg",
  },
  {
    id: "uttara-mobile-management",
    title: "Uttara Mobile Management System",
    category: "Retail & Service Management",
    type: "Business management application",
    overview:
      "A business management application for mobile retail and servicing operations. It centralizes inventory, sales, customer records, billing, and repair-service workflows.",
    capabilities: [
      "Product, category, and supplier management",
      "Stock tracking",
      "Sales and billing",
      "Customer records",
      "Mobile repair service orders",
      "Invoice and payment records",
      "Dashboard and business reports",
    ],
    techStack: ["PHP", "MySQL/MariaDB", "Bootstrap 5", "JavaScript", "CSS3", "Bootstrap Icons"],
    image: "/api/project-asset/Business%20Management.jpeg",
  },
  {
    id: "parents-medicine-reminder",
    title: "Parents Medicine Reminder",
    category: "Healthcare & Medication Management",
    type: "Progressive Web Application",
    overview:
      "A healthcare-focused application intended to help families organize medication schedules and keep track of medicine routines for their parents through an accessible digital experience.",
    capabilities: [
      "Medication schedule management",
      "Dose-record tracking",
      "Medicine reminder experience",
      "Accessible interface",
      "Progressive Web App experience",
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "MongoDB", "Mongoose", "IndexedDB"],
    image: "/api/project-asset/Medicine%20Rteminder.jpeg",
  },
];

/**
 * Authentic Client Testimonials & Partnership Voices
 */
export const clientTestimonials: TestimonialItem[] = [
  {
    id: "t1",
    clientName: "S. Rahman",
    role: "Managing Director",
    company: "Amirjaan Hometex",
    industry: "Retail & Textile Manufacturing",
    projectContext: "Corporate Digital Storefront & Catalog Modernization",
    quote:
      "WIZZO Solutions delivered our digital platform with genuine care and technical discipline. Their communication remained transparent at every step, and the resulting website is fast, dependable, and easy for our customers to navigate.",
  },
  {
    id: "t2",
    clientName: "K. Islam",
    role: "Operations Director",
    company: "4P Digital Solutions",
    industry: "Enterprise Technology & Procurement",
    projectContext: "B2B Procurement & Quotation Management Workflow",
    quote:
      "What stands out about WIZZO is their practical approach to problem-solving. They took the time to understand how our procurement team operates and built an intuitive system that cut our manual processing time in half.",
  },
  {
    id: "t3",
    clientName: "Engineering Colleague & Partner",
    role: "Senior Systems Architect",
    company: "Regional Technology Collaborator",
    industry: "Software Engineering & Infrastructure",
    projectContext: "Full-Stack Web Application Architecture",
    quote:
      "The engineering team at WIZZO brings solid architectural rigor, clean code organization, and high respect for software reliability. They deliver on their commitments without unnecessary excuses.",
  },
];

/**
 * The 10 Specialized Tracks in WIZZO Internship Program
 */
export const internshipTracks: InternshipTrack[] = [
  {
    id: "fullstack-dev",
    title: "Full-Stack / Web Development",
    category: "Engineering",
    duration: "3 - 6 Months",
    commitment: "Hybrid / On-site (Dhaka)",
    description: "Learn production Next.js, TypeScript, RESTful API architecture, and relational database modeling on active projects.",
    skillsGained: ["Next.js", "TypeScript", "PostgreSQL", "Git Workflows", "API Design"],
    iconName: "Code2",
  },
  {
    id: "frontend-dev",
    title: "Frontend Engineering",
    category: "Engineering",
    duration: "3 - 6 Months",
    commitment: "Hybrid",
    description: "Master modern UI development, component state management, accessibility compliance, and Framer Motion micro-interactions.",
    skillsGained: ["React 19", "Tailwind CSS", "Framer Motion", "Responsive Layouts", "Web Vitals"],
    iconName: "Layout",
  },
  {
    id: "backend-dev",
    title: "Backend Engineering",
    category: "Engineering",
    duration: "3 - 6 Months",
    commitment: "Hybrid",
    description: "Build robust server architectures, database migrations, authentication security, and scalable background workers.",
    skillsGained: ["Node.js", "Go/Express", "Drizzle ORM", "Redis", "Security Best Practices"],
    iconName: "Database",
  },
  {
    id: "uiux-design",
    title: "UI/UX Product Design",
    category: "Design",
    duration: "3 - 6 Months",
    commitment: "Hybrid",
    description: "Conduct user research, establish design systems in Figma, and build wireframes and high-fidelity clickable prototypes.",
    skillsGained: ["Figma", "Design Systems", "User Journeys", "Typography & Spacing", "Prototyping"],
    iconName: "Palette",
  },
  {
    id: "qa-testing",
    title: "QA & Software Testing",
    category: "Engineering",
    duration: "3 - 6 Months",
    commitment: "Hybrid",
    description: "Learn automated unit testing, end-to-end user journey validation, API testing with Postman, and regression tracking.",
    skillsGained: ["Test Automation", "Bug Reporting", "API Validation", "Cross-Browser QA"],
    iconName: "CheckCheck",
  },
  {
    id: "ai-ml",
    title: "Artificial Intelligence & Automation",
    category: "Engineering",
    duration: "3 - 6 Months",
    commitment: "Hybrid",
    description: "Explore practical LLM integrations, document parsing, automated summarization, and data transformation pipelines.",
    skillsGained: ["Gemini / OpenAI APIs", "Python Data Tooling", "Workflow Automation", "Prompt Engineering"],
    iconName: "Bot",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Hardening",
    category: "Infrastructure",
    duration: "3 - 6 Months",
    commitment: "Hybrid",
    description: "Hands-on vulnerability scanning, OWASP top 10 compliance audits, secure headers, and access control validation.",
    skillsGained: ["OWASP Security", "Audit Logging", "SSL/TLS Hardening", "Environment Protection"],
    iconName: "ShieldCheck",
  },
  {
    id: "networking-it",
    title: "Networking & IT Infrastructure",
    category: "Infrastructure",
    duration: "3 - 6 Months",
    commitment: "On-site",
    description: "Support workstation setups, server diagnostics, DNS routing, VPN configurations, and cloud server provisioning.",
    skillsGained: ["DNS & Domain Routing", "Linux Server Admin", "Cloud Hosting", "Network Security"],
    iconName: "Network",
  },
  {
    id: "business-dev",
    title: "Business Development",
    category: "Business",
    duration: "3 - 6 Months",
    commitment: "Hybrid",
    description: "Participate in client discovery calls, market research, technical proposal preparation, and client relationship management.",
    skillsGained: ["Client Discovery", "Proposal Writing", "Market Research", "B2B Communication"],
    iconName: "TrendingUp",
  },
  {
    id: "sales-marketing",
    title: "Digital Marketing & Content",
    category: "Business",
    duration: "3 - 6 Months",
    commitment: "Remote / Hybrid",
    description: "Create technical content, analyze website traffic with Google Search Console, and write engaging case studies.",
    skillsGained: ["Technical Writing", "SEO Analysis", "Social Media Strategy", "Case Study Curation"],
    iconName: "Megaphone",
  },
];

/**
 * Editorial Insights Articles
 */
export const insightsArticles: InsightArticle[] = [
  {
    id: "1",
    title: "Why Pragmatic Architecture Outperforms Over-Engineered Software",
    category: "Software Engineering",
    readTime: "5 min read",
    publishedDate: "November 2026",
    excerpt:
      "In early-stage and growing businesses, software failures rarely stem from missing microservices. They stem from unnecessary complexity, unmaintainable code, and solving problems that don't yet exist.",
    author: "WIZZO Technical Team",
  },
  {
    id: "2",
    title: "The Modern Corporate Website: From Brochure to Active Business Engine",
    category: "Web Strategy",
    readTime: "4 min read",
    publishedDate: "October 2026",
    excerpt:
      "A corporate website is no longer a static business card. Sub-second loading, clean typographic hierarchy, and clear conversion paths transform passive visitors into qualified commercial inquiries.",
    author: "WIZZO Design Team",
  },
  {
    id: "3",
    title: "Pragmatic Business Automation: Where Growing Teams Win Back Time",
    category: "Operations & Automation",
    readTime: "6 min read",
    publishedDate: "September 2026",
    excerpt:
      "Before investing in monolithic ERP overhauls, identify the repetitive data bridges your team performs daily. Automating inventory sync and customer notifications yields immediate ROI with zero friction.",
    author: "WIZZO Solutions Team",
  },
];

/**
 * Genuine Verified Client and Partner Marks
 */
export const verifiedPartners = [
  { name: "Tasnim Builders", logo: "/api/brand-asset/Tasnim%20Builders.jpeg" },
  { name: "4P Digital Solutions", logo: "/api/brand-asset/4pds%20logo%20web%20transparent.png" },
  { name: "Hexa", logo: "/api/brand-asset/Hexa%20Logo.jpeg" },
  { name: "K.H Construction & Engineering", logo: "/api/brand-asset/KH%20Contructions.jpeg" },
  { name: "Kooza", logo: "/api/brand-asset/kooza.jpg" },
  { name: "Nakama", logo: "/api/brand-asset/Nakama.jpg" },
  { name: "Re-tired", logo: "/api/brand-asset/Re-tired%20logo.png" },
];
