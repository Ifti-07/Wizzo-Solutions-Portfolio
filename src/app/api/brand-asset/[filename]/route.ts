import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const BRAND_DIR = path.join(process.cwd(), "Wizzo Logo");
const TRUSTED_LOGO_DIR = path.join(BRAND_DIR, "trusted logo");

// Supported logo filenames mapped to their location on disk
const ALLOWED_FILES = new Map<string, string>([
  ["First Logo With title.png", path.join(BRAND_DIR, "First Logo With title.png")],
  ["First Logo Without title.png", path.join(BRAND_DIR, "First Logo Without title.png")],
  ["Secondary Logo with title.png", path.join(BRAND_DIR, "Secondary Logo with title.png")],
  ["Secondary Logo without title.png", path.join(BRAND_DIR, "Secondary Logo without title.png")],
  ["Wizzo 2nd Logo w text.png", path.join(process.cwd(), "Wizzo 2nd Logo w text.png")],
  ["Wizzo Logo w text.svg", path.join(process.cwd(), "Wizzo Logo w text.svg")],
  ["Tasnim Builders.jpeg", path.join(TRUSTED_LOGO_DIR, "Tasnim Builders.jpeg")],
  ["Nakama.jpg", path.join(TRUSTED_LOGO_DIR, "Nakama.jpg")],
  ["kooza.jpg", path.join(TRUSTED_LOGO_DIR, "kooza.jpg")],
  ["KH Contructions.jpeg", path.join(TRUSTED_LOGO_DIR, "KH Contructions.jpeg")],
  ["Hexa Logo.jpeg", path.join(TRUSTED_LOGO_DIR, "Hexa Logo.jpeg")],
  ["4pds logo web transparent.png", path.join(TRUSTED_LOGO_DIR, "4pds logo web transparent.png")],
]);

const CONTENT_TYPES: Record<string, string> = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

function contentTypeFor(name: string) {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const decoded = decodeURIComponent(filename);

  const filePath = ALLOWED_FILES.get(decoded);
  if (!filePath) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  try {
    const data = await readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentTypeFor(decoded),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File could not be read" }, { status: 404 });
  }
}
