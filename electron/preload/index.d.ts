import { ElectronAPI } from "@electron-toolkit/preload";

type DbMethod = "run" | "all" | "values" | "get";

type DbQuery = {
  sql: string;
  params: unknown[];
  method: DbMethod;
};

interface DbApi {
  execute: (sql: string, params: unknown[], method: DbMethod) => Promise<{ rows: unknown[] }>;
  batch: (queries: DbQuery[]) => Promise<Array<{ rows: unknown[] }>>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: { db: DbApi };
  }
}
