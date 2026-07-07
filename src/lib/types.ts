export type Client = {
  id: string;
  title: string;
};

export type Project = {
  id: string;
  title: string;
  clientId: string;
};

export type Task = {
  id: string;
  title: string;
  projectId: string;
  isCompleted: boolean;
};

export type Log = {
  id: string;
  taskId: string;
  start: Date;
  end: Date;
};
