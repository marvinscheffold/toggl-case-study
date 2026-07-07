"use client";

import { Building2, Folder, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClients, useLogs, useProjects, useTasks } from "@/lib/hooks";
import { formatDuration } from "@/lib/utils";

export default function TasksPage() {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { clients } = useClients();
  const { logs } = useLogs();

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b px-8 py-4">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <Button size="lg">
          <Plus />
          Create task
        </Button>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Logged</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const client = clients.find((c) => c.id === project?.clientId);
            const loggedMs = logs
              .filter((log) => log.taskId === task.id)
              .reduce(
                (total, log) =>
                  total + (log.end.getTime() - log.start.getTime()),
                0
              );
            return (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <Folder className="size-4 text-muted-foreground" />
                    {project?.title ?? "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    {client?.title ?? "—"}
                  </span>
                </TableCell>
                <TableCell>
                  {loggedMs > 0 ? formatDuration(loggedMs) : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
