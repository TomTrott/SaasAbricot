import { tasks } from "../../data/mockdata";
import KanbanColumn from "./KanbanColumn";
import type { Task } from "./types";

export default function TaskKanbanView() {
  const todoTasks = (tasks as Task[]).filter(
    (task) => task.status === "TODO"
  );

  const progressTasks = (
    tasks as Task[]
  ).filter(
    (task) => task.status === "IN_PROGRESS"
  );

  const doneTasks = (tasks as Task[]).filter(
    (task) => task.status === "DONE"
  );

  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      "
    >
      <KanbanColumn
        title="À faire"
        tasks={todoTasks}
        borderColor="border-[#ffd9d9]"
      />

      <KanbanColumn
        title="En cours"
        tasks={progressTasks}
        borderColor="border-[#ffe8c7]"
      />

      <KanbanColumn
        title="Terminées"
        tasks={doneTasks}
        borderColor="border-[#ddf8e7]"
      />
    </div>
  );
}