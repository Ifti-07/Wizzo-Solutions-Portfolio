import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole("ADMIN");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [app] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, Number(id)))
    .limit(1);
  if (!app?.cvPath) return NextResponse.json({ error: "No CV found" }, { status: 404 });

  const safeName = path.basename(app.cvPath);
  const candidatePaths = [
    path.join(process.cwd(), "uploads", "cv", safeName),
    path.join("/tmp", "uploads", "cv", safeName),
  ];

  let file: Buffer | null = null;
  for (const fp of candidatePaths) {
    try {
      file = await readFile(fp);
      break;
    } catch {
      continue;
    }
  }

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const ext = safeName.split(".").pop()?.toLowerCase() ?? "pdf";
  const mime =
    ext === "pdf" ? "application/pdf"
    : ext === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    : "application/msword";

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="${app.fullName.replace(/\s+/g, "_")}_CV.${ext}"`,
    },
  });
}
