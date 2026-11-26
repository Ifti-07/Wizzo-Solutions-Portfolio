import { pool } from "@/db";
import { ensureDatabaseSchema } from "@/db/auto-migrate";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "standalone";
  if (pool) {
    try {
      await ensureDatabaseSchema();
      await pool.query("SELECT 1");
      dbStatus = "connected";
    } catch {
      dbStatus = "error";
    }
  }

  return Response.json(
    {
      ok: dbStatus !== "error",
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      env: process.env.NODE_ENV,
    },
    { status: dbStatus === "error" ? 503 : 200 }
  );
}

