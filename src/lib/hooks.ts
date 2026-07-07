import { useStore } from "@/lib/store";

export function useClients() {
  const clients = useStore((state) => state.clients);
  const addClient = useStore((state) => state.addClient);
  const updateClient = useStore((state) => state.updateClient);
  const removeClient = useStore((state) => state.removeClient);

  return { clients, addClient, updateClient, removeClient };
}

export function useProjects() {
  const projects = useStore((state) => state.projects);
  const addProject = useStore((state) => state.addProject);
  const updateProject = useStore((state) => state.updateProject);
  const removeProject = useStore((state) => state.removeProject);

  return { projects, addProject, updateProject, removeProject };
}

export function useTasks() {
  const tasks = useStore((state) => state.tasks);
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  const removeTask = useStore((state) => state.removeTask);

  return { tasks, addTask, updateTask, removeTask };
}

export function useLogs() {
  const logs = useStore((state) => state.logs);
  const addLog = useStore((state) => state.addLog);
  const updateLog = useStore((state) => state.updateLog);
  const removeLog = useStore((state) => state.removeLog);

  return { logs, addLog, updateLog, removeLog };
}
