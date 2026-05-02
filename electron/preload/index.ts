import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

type DbMethod = "run" | "all" | "values" | "get";

type DbQuery = {
  sql: string;
  params: unknown[];
  method: DbMethod;
};

const api = {
  db: {
    execute: (sql: string, params: unknown[], method: DbMethod) =>
      ipcRenderer.invoke("db:execute", sql, params, method) as Promise<{
        rows: unknown[];
      }>,
    batch: (queries: DbQuery[]) =>
      ipcRenderer.invoke("db:batch", queries) as Promise<Array<{ rows: unknown[] }>>,
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
