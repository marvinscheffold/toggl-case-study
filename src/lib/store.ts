import { create } from "zustand";

import type { Client, Log, Project, Task } from "@/lib/types";

type StoreState = {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  logs: Log[];

  addClient: (client: Omit<Client, "id">) => Client;
  updateClient: (
    id: string,
    updates: Partial<Omit<Client, "id">>,
  ) => void;
  removeClient: (id: string) => void;

  addProject: (project: Omit<Project, "id">) => Project;
  updateProject: (
    id: string,
    updates: Partial<Omit<Project, "id">>,
  ) => void;
  removeProject: (id: string) => void;

  addTask: (task: Omit<Task, "id">) => Task;
  updateTask: (
    id: string,
    updates: Partial<Omit<Task, "id">>,
  ) => void;
  removeTask: (id: string) => void;

  addLog: (log: Omit<Log, "id">) => Log;
  updateLog: (id: string, updates: Partial<Omit<Log, "id">>) => void;
  removeLog: (id: string) => void;
};

// Dummy seed data, evaluated once at module load so the log's
// 35-minute window ending "now" is fixed until the app is reloaded.
const seedLogEnd = new Date();
const seedLogStart = new Date(seedLogEnd.getTime() - 120 * 60 * 1000);

const seedClient: Client = { id: "client-1", title: "Acme Inc." };
const seedProject: Project = {
  id: "project-1",
  title: "Website Redesign",
  clientId: seedClient.id,
};
const seedTask: Task = {
  id: "task-1",
  title: "Design landing page",
  projectId: seedProject.id,
  isCompleted: false,
};
const seedLog: Log = {
  id: "log-1",
  taskId: seedTask.id,
  start: seedLogStart,
  end: seedLogEnd,
};

export const useStore = create<StoreState>((set) => ({
  clients: [seedClient],
  projects: [seedProject],
  tasks: [seedTask],
  logs: [seedLog],

  addClient: (client) => {
    const newClient: Client = { id: crypto.randomUUID(), ...client };
    set((state) => ({ clients: [...state.clients, newClient] }));
    return newClient;
  },
  updateClient: (id, updates) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      ),
    })),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    })),

  addProject: (project) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      ...project,
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
    return newProject;
  },
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

  addTask: (task) => {
    const newTask: Task = { id: crypto.randomUUID(), ...task };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    return newTask;
  },
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  addLog: (log) => {
    const newLog: Log = { id: crypto.randomUUID(), ...log };
    set((state) => ({ logs: [...state.logs, newLog] }));
    return newLog;
  },
  updateLog: (id, updates) =>
    set((state) => ({
      logs: state.logs.map((l) =>
        l.id === id ? { ...l, ...updates } : l,
      ),
    })),
  removeLog: (id) =>
    set((state) => ({ logs: state.logs.filter((l) => l.id !== id) })),
}));
