export type Task = {
  id: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  project: string;
  dueDate: string;
  comments: number;
};