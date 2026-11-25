import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __wizzoPostgresPool?: Pool;
};

export const pool = databaseUrl
  ? globalForDb.__wizzoPostgresPool ??
    new Pool({
      connectionString: databaseUrl,
      ssl:
        databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
          ? false
          : { rejectUnauthorized: false },
    })
  : null;

if (pool && process.env.NODE_ENV !== "production") {
  globalForDb.__wizzoPostgresPool = pool;
}

// Graceful Drizzle instance or proxy that won't throw on import if DATABASE_URL is not set
export const db = pool
  ? drizzle(pool)
  : (new Proxy(
      {},
      {
        get() {
          return () => {
            throw new Error("DATABASE_URL is not configured.");
          };
        },
      }
    ) as ReturnType<typeof drizzle>);
