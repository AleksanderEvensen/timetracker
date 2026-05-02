import { app, ipcMain } from "electron";
import { isAbsolute, join, resolve } from "node:path";
import { createClient, type Client, type InValue } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

export type DbMethod = "run" | "all" | "values" | "get";

export type DbQuery = {
  sql: string;
  params: InValue[];
  method: DbMethod;
};

let client: Client | null = null;

function resolveDbPath(): string {
  const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
  const override = env.MAIN_VITE_DB_PATH;
  if (override && override.length > 0) {
    return isAbsolute(override) ? override : resolve(process.cwd(), override);
  }
  return join(app.getPath("userData"), "timetracker.db");
}

function getClient(): Client {
  if (!client) {
    const dbPath = resolveDbPath();
    console.log("[DB] Initializing client with path:", dbPath);
    client = createClient({ url: `file:${dbPath}`, intMode: "number" });
  }
  return client;
}

function rowsToArrays(rows: Record<string, unknown>[], columns: string[]): unknown[][] {
  return rows.map((row) => columns.map((col) => row[col]));
}

async function execute(query: DbQuery): Promise<{ rows: unknown[] }> {
  const result = await getClient().execute({
    sql: query.sql,
    args: query.params,
  });
  const rows = rowsToArrays(result.rows as unknown as Record<string, unknown>[], result.columns);
  if (query.method === "get") {
    return { rows: rows[0] ?? [] };
  }
  return { rows };
}

export async function runMigrations(): Promise<void> {
  const db = drizzle(getClient());
  const migrationsFolder = app.isPackaged
    ? join(process.resourcesPath, "drizzle")
    : join(app.getAppPath(), "drizzle");
  await migrate(db, { migrationsFolder });
}

export function registerDbIpc(): void {
  ipcMain.handle("db:execute", async (_event, sql: string, params: InValue[], method: DbMethod) => {
    return execute({ sql, params, method });
  });

  ipcMain.handle("db:batch", async (_event, queries: DbQuery[]) => {
    const c = getClient();
    const results = await c.batch(
      queries.map((q) => ({ sql: q.sql, args: q.params })),
      "deferred",
    );
    return results.map((result, i) => {
      const rows = rowsToArrays(
        result.rows as unknown as Record<string, unknown>[],
        result.columns,
      );
      return queries[i].method === "get" ? { rows: rows[0] ?? [] } : { rows };
    });
  });
}

export function closeDb(): void {
  client?.close();
  client = null;
}
