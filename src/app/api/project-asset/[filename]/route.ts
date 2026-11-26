import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const PROJECT_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "project");
const PUBLIC_PROJECT_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "project");

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safe = path.basename(decodeURIComponent(filename));

  const candidatePaths = [
    path.join(PROJECT_DIR, safe),
    path.join(PUBLIC_PROJECT_DIR, safe),
  ];

  for (const filePath of candidatePaths) {
    try {
      const data = await readFile(filePath);
      const ext = safe.toLowerCase().split(".").pop() ?? "";
      return new NextResponse(new Uint8Array(data), {
        headers: {
          "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ error: "Asset not found" }, { status: 404 });
}
