import { promises as fs } from "fs";
import path from "path";

export type StoredJob = {
  id: number;
  title: string;
  type: "INTERNSHIP" | "FULL_TIME";
  category: string;
  location: string;
  description: string;
  requirements: string;
  deadline: string | null;
  open: boolean;
  createdAt: string;
};

// Detect serverless environment (e.g. Vercel, AWS Lambda)
const isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production"
);
const DATA_DIR = isServerless ? "/tmp" : path.join(process.cwd(), "data");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");

let memoryJobs: StoredJob[] = [];

async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(JOBS_FILE);
    } catch {
      await fs.writeFile(JOBS_FILE, JSON.stringify(memoryJobs, null, 2), "utf8");
    }
  } catch {
    // Read-only filesystem or temporary container — safely maintain in-memory store
  }
}

export async function getStoredJobs(): Promise<StoredJob[]> {
  try {
    await ensureFile();
    const raw = await fs.readFile(JOBS_FILE, "utf8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      memoryJobs = data;
    }
  } catch {
    // Use in-memory if file read fails
  }
  return [...memoryJobs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveStoredJob(data: {
  id?: number;
  title: string;
  type: "INTERNSHIP" | "FULL_TIME";
  category?: string;
  location?: string;
  description: string;
  requirements?: string;
  deadline?: string | null;
  open?: boolean;
}): Promise<StoredJob> {
  const current = await getStoredJobs();
  if (data.id) {
    const existingIndex = current.findIndex((j) => j.id === data.id);
    if (existingIndex >= 0) {
      const updated: StoredJob = {
        ...current[existingIndex],
        title: data.title,
        type: data.type,
        category: data.category || current[existingIndex].category || "Engineering",
        location: data.location || current[existingIndex].location || "Dhaka, Bangladesh",
        description: data.description,
        requirements: data.requirements ?? current[existingIndex].requirements ?? "",
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        open: data.open ?? current[existingIndex].open ?? true,
      };
      current[existingIndex] = updated;
      memoryJobs = current;
      try {
        await ensureFile();
        await fs.writeFile(JOBS_FILE, JSON.stringify(memoryJobs, null, 2), "utf8");
      } catch {}
      return updated;
    }
  }

  const nextId = current.length > 0 ? Math.max(...current.map((j) => j.id)) + 1 : 1;
  const newJob: StoredJob = {
    id: nextId,
    title: data.title,
    type: data.type,
    category: data.category || "Engineering",
    location: data.location || "Dhaka, Bangladesh",
    description: data.description,
    requirements: data.requirements || "",
    deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
    open: data.open ?? true,
    createdAt: new Date().toISOString(),
  };

  memoryJobs = [newJob, ...current];
  try {
    await ensureFile();
    await fs.writeFile(JOBS_FILE, JSON.stringify(memoryJobs, null, 2), "utf8");
  } catch {}
  return newJob;
}

export async function toggleStoredJob(id: number, open: boolean): Promise<boolean> {
  const current = await getStoredJobs();
  memoryJobs = current.map((j) => (j.id === id ? { ...j, open } : j));
  try {
    await ensureFile();
    await fs.writeFile(JOBS_FILE, JSON.stringify(memoryJobs, null, 2), "utf8");
  } catch {}
  return true;
}

export async function deleteStoredJob(id: number): Promise<boolean> {
  const current = await getStoredJobs();
  memoryJobs = current.filter((j) => j.id !== id);
  try {
    await ensureFile();
    await fs.writeFile(JOBS_FILE, JSON.stringify(memoryJobs, null, 2), "utf8");
  } catch {}
  return true;
}
