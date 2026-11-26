import { promises as fs } from "fs";
import path from "path";

export type Inquiry = {
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

// Detect serverless environment (e.g. Vercel, AWS Lambda)
const isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production"
);
const DATA_DIR = isServerless ? "/tmp" : path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

const sampleInquiries: Inquiry[] = [
  {
    id: 1,
    name: "Tariqul Islam",
    email: "tariqul@apexsolutions.com",
    phone: "+880 1712-345678",
    company: "Apex Enterprise Solutions",
    service: "Custom Software Development",
    message: "Greetings Wizzo team. We are planning an enterprise internal ERP & process automation system. We'd like to schedule an architecture consultation session to discuss scope and timelines.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 2,
    name: "Sara Rahman",
    email: "sara.rahman@fintechhub.net",
    phone: "+880 1819-987654",
    company: "Fintech Hub",
    service: "Web Application Development",
    message: "We need a secure client portal with role-based access control and analytics dashboards. Please let us know your availability for a project kickoff meeting.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
];

let memoryInquiries: Inquiry[] = [...sampleInquiries];

async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(INQUIRIES_FILE);
    } catch {
      await fs.writeFile(INQUIRIES_FILE, JSON.stringify(memoryInquiries, null, 2), "utf8");
    }
  } catch {
    // Read-only filesystem or temporary container — safely maintain in-memory store
  }
}

export async function getStoredInquiries(): Promise<Inquiry[]> {
  try {
    await ensureFile();
    const raw = await fs.readFile(INQUIRIES_FILE, "utf8");
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) {
      memoryInquiries = data;
    }
  } catch {
    // Use in-memory if file read fails
  }
  return [...memoryInquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveInquiry(item: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message: string;
}): Promise<Inquiry> {
  const current = await getStoredInquiries();
  const nextId = current.length > 0 ? Math.max(...current.map((i) => i.id)) + 1 : 1;
  const newInquiry: Inquiry = {
    id: nextId,
    name: item.name,
    email: item.email,
    phone: item.phone || null,
    company: item.company || null,
    service: item.service || null,
    message: item.message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  memoryInquiries = [newInquiry, ...current];
  try {
    await ensureFile();
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify(memoryInquiries, null, 2), "utf8");
  } catch {
    // Memory store updated
  }
  return newInquiry;
}

export async function markInquiryRead(id: number, read: boolean): Promise<boolean> {
  const current = await getStoredInquiries();
  memoryInquiries = current.map((i) => (i.id === id ? { ...i, read } : i));
  try {
    await ensureFile();
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify(memoryInquiries, null, 2), "utf8");
  } catch {
    // Memory store updated
  }
  return true;
}

export async function deleteInquiry(id: number): Promise<boolean> {
  const current = await getStoredInquiries();
  memoryInquiries = current.filter((i) => i.id !== id);
  try {
    await ensureFile();
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify(memoryInquiries, null, 2), "utf8");
  } catch {
    // Memory store updated
  }
  return true;
}
