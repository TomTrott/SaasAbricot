"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import KanbanColumn from "./KanbanColumn";
import type { Task } from "./types";

export default function TaskKanbanView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  async function fetchAssignedTasks() {
    try {
      const response = await api.get(
        "/dashboard/assigned-tasks"
      );

      setTasks(
        response.data.data.tasks
      );
    } catch (error) {
      console.error(
        "Erreur récupération tâches",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  );

  const progressTasks = tasks.filter(
    (task) =>
      task.status === "IN_PROGRESS"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "DONE"
  );

  if (loading) {
    return (
      <div className="bg-white border border-[#e7e7e7] rounded-[18px] p-8 text-[#8a8f98]">
        Chargement des tâches...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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