import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "./schema";

export const db = drizzle(
  async (sql, params, method) => {
    const result = await window.api.db.execute(sql, params, method);
    return result as { rows: unknown[] };
  },
  async (queries) => {
    const result = await window.api.db.batch(
      queries.map((q) => ({
        sql: q.sql,
        params: q.params,
        method: q.method,
      })),
    );
    return result as Array<{ rows: unknown[] }>;
  },
  { schema, casing: "snake_case" },
);

export { schema };
