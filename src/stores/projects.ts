import { create } from "zustand";

export type Project = {
  id: string;
  name: string;
  startDate: string;
  hourlyRate: number;
  hoursWorked: number;
};

export type NewProject = Omit<Project, "id" | "hoursWorked">;

type ProjectsState = {
  projects: Project[];
  currentProjectId: string | null;
  createProject: (data: NewProject) => Project;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
};

const seed: Project[] = [
  {
    id: "build-pilot",
    name: "Build Pilot",
    startDate: "2026-02-14",
    hourlyRate: 95,
    hoursWorked: 42.5,
  },
  {
    id: "acme-website",
    name: "Acme Website",
    startDate: "2026-01-08",
    hourlyRate: 80,
    hoursWorked: 117,
  },
  {
    id: "internal-dashboard",
    name: "Internal Dashboard",
    startDate: "2026-03-21",
    hourlyRate: 110,
    hoursWorked: 12.25,
  },
];

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: seed,
  currentProjectId: seed[0]?.id ?? null,
  createProject: (data) => {
    const project: Project = {
      ...data,
      id: crypto.randomUUID(),
      hoursWorked: 0,
    };
    set((state) => ({ projects: [...state.projects, project] }));
    return project;
  },
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProjectId:
        state.currentProjectId === id ? null : state.currentProjectId,
    }));
  },
  setCurrentProject: (id) => set({ currentProjectId: id }),
}));
