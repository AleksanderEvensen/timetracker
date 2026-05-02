import { create } from "zustand";

export type TimeEntry = {
  id: string;
  start: string;
  end: string;
};

export type Task = {
  id: string;
  projectId: string;
  name: string;
  entries: TimeEntry[];
  runningSince?: string;
};

export type EntryUpdate = {
  taskId?: string;
  start?: string;
  end?: string;
};

export type NewEntry = {
  start: string;
  end: string;
};

type TasksState = {
  tasks: Task[];
  addTask: (projectId: string, name: string) => Task;
  startTask: (taskId: string) => void;
  stopTask: (taskId: string) => void;
  addEntry: (taskId: string, entry: NewEntry) => TimeEntry | null;
  updateEntry: (
    currentTaskId: string,
    entryId: string,
    update: EntryUpdate,
  ) => void;
  deleteEntry: (taskId: string, entryId: string) => void;
};

const seed: Task[] = [
  {
    id: "build-pilot-onboarding",
    projectId: "build-pilot",
    name: "Onboarding flow",
    entries: [
      {
        id: "bp-e1",
        start: "2026-04-30T09:00:00.000Z",
        end: "2026-04-30T10:30:00.000Z",
      },
      {
        id: "bp-e2",
        start: "2026-04-30T13:00:00.000Z",
        end: "2026-04-30T14:15:00.000Z",
      },
      {
        id: "bp-e3",
        start: "2026-04-29T10:00:00.000Z",
        end: "2026-04-29T12:45:00.000Z",
      },
      {
        id: "bp-e4",
        start: "2026-04-27T08:30:00.000Z",
        end: "2026-04-27T11:00:00.000Z",
      },
    ],
  },
  {
    id: "build-pilot-landing",
    projectId: "build-pilot",
    name: "Landing page copy",
    entries: [
      {
        id: "bp-e5",
        start: "2026-04-28T15:00:00.000Z",
        end: "2026-04-28T17:00:00.000Z",
      },
    ],
  },
  {
    id: "build-pilot-bugfix",
    projectId: "build-pilot",
    name: "Tracker bugfix",
    entries: [],
  },
  {
    id: "acme-design",
    projectId: "acme-website",
    name: "Visual redesign",
    entries: [
      {
        id: "ac-e1",
        start: "2026-04-27T09:00:00.000Z",
        end: "2026-04-27T11:30:00.000Z",
      },
    ],
  },
];

function finalizeRunningEntry(task: Task, end: string): Task {
  if (!task.runningSince) return task;
  return {
    ...task,
    runningSince: undefined,
    entries: [
      ...task.entries,
      {
        id: crypto.randomUUID(),
        start: task.runningSince,
        end,
      },
    ],
  };
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: seed,
  addTask: (projectId, name) => {
    const task: Task = {
      id: crypto.randomUUID(),
      projectId,
      name,
      entries: [],
    };
    set((state) => ({ tasks: [...state.tasks, task] }));
    return task;
  },
  startTask: (taskId) =>
    set((state) => {
      const now = new Date().toISOString();
      const target = state.tasks.find((t) => t.id === taskId);
      if (!target) return state;
      return {
        tasks: state.tasks.map((t) => {
          if (
            t.runningSince &&
            t.projectId === target.projectId &&
            t.id !== taskId
          ) {
            return finalizeRunningEntry(t, now);
          }
          if (t.id === taskId) {
            return { ...t, runningSince: now };
          }
          return t;
        }),
      };
    }),
  stopTask: (taskId) =>
    set((state) => {
      const now = new Date().toISOString();
      return {
        tasks: state.tasks.map((t) =>
          t.id === taskId ? finalizeRunningEntry(t, now) : t,
        ),
      };
    }),
  addEntry: (taskId, entry) => {
    let created: TimeEntry | null = null;
    set((state) => {
      const target = state.tasks.find((t) => t.id === taskId);
      if (!target) return state;
      created = {
        id: crypto.randomUUID(),
        start: entry.start,
        end: entry.end,
      };
      return {
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, entries: [...t.entries, created!] } : t,
        ),
      };
    });
    return created;
  },
  updateEntry: (currentTaskId, entryId, update) =>
    set((state) => {
      const source = state.tasks.find((t) => t.id === currentTaskId);
      const entry = source?.entries.find((e) => e.id === entryId);
      if (!source || !entry) return state;
      const targetTaskId = update.taskId ?? currentTaskId;
      const updatedEntry: TimeEntry = {
        ...entry,
        start: update.start ?? entry.start,
        end: update.end ?? entry.end,
      };
      const moved = targetTaskId !== currentTaskId;
      return {
        tasks: state.tasks.map((t) => {
          if (t.id === currentTaskId) {
            return moved
              ? { ...t, entries: t.entries.filter((e) => e.id !== entryId) }
              : {
                  ...t,
                  entries: t.entries.map((e) =>
                    e.id === entryId ? updatedEntry : e,
                  ),
                };
          }
          if (moved && t.id === targetTaskId) {
            return { ...t, entries: [...t.entries, updatedEntry] };
          }
          return t;
        }),
      };
    }),
  deleteEntry: (taskId, entryId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, entries: t.entries.filter((e) => e.id !== entryId) }
          : t,
      ),
    })),
}));

export function entryDurationSeconds(entry: TimeEntry): number {
  return (
    (new Date(entry.end).getTime() - new Date(entry.start).getTime()) / 1000
  );
}

export function taskTotalSeconds(task: Task, now = Date.now()): number {
  const completed = task.entries.reduce(
    (acc, e) => acc + entryDurationSeconds(e),
    0,
  );
  if (task.runningSince) {
    return (
      completed + (now - new Date(task.runningSince).getTime()) / 1000
    );
  }
  return completed;
}
