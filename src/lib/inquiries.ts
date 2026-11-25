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

const DATA_DIR = path.join(process.cwd(), "data");
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

async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(INQUIRIES_FILE);
    } catch {
      await fs.writeFile(INQUIRIES_FILE, JSON.stringify(sampleInquiries, null, 2), "utf8");
    }
  } catch (e) {
    console.error("Error ensuring inquiries file:", e);
  }
}

export async function getStoredInquiries(): Promise<Inquiry[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(INQUIRIES_FILE, "utf8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (e) {
    console.error("Failed to read stored inquiries:", e);
  }
  return sampleInquiries;
}

export async function saveInquiry(item: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message: string;
}): Promise<Inquiry> {
  await ensureFile();
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
  const updated = [newInquiry, ...current];
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(updated, null, 2), "utf8");
  return newInquiry;
}

export async function markInquiryRead(id: number, read: boolean): Promise<boolean> {
  await ensureFile();
  const current = await getStoredInquiries();
  const updated = current.map((item) => (item.id === id ? { ...item, read } : item));
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(updated, null, 2), "utf8");
  return true;
}

export async function deleteInquiry(id: number): Promise<boolean> {
  await ensureFile();
  const current = await getStoredInquiries();
  const updated = current.filter((item) => item.id !== id);
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(updated, null, 2), "utf8");
  return true;
}
