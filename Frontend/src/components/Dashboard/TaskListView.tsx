"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "@/services/api";
import TaskCard from "./TaskCard";
import type { Task } from "./types";

export default function TaskListView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Récupère les tâches assignées
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/dashboard/assigned-tasks");
        setTasks(response.data.data.tasks || []);
      } catch (error) {
        console.error("Erreur récupération tâches", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Filtre les tâches par titre
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="bg-white border border-[#e7e7e7] rounded-[18px] p-5 sm:p-7 lg:p-10"><p className="text-[#667085]">Chargement des tâches...</p></div>;
  }

  return (
    <div className="bg-white border border-[#e7e7e7] rounded-[18px] p-5 sm:p-7 lg:p-10">
      {/* En-tête avec titre et barre de recherche */}
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6 mb-8">
        <div>
          <h2 className="text-[24px] sm:text-[26px] lg:text-[30px] font-bold text-[#1f1f1f]">Mes tâches assignées</h2>
          <p className="mt-1 text-[15px] sm:text-[17px] lg:text-[18px] text-[#5f6670]">
            Par ordre de priorité
          </p>
        </div>
        <div className="w-full xl:w-[340px] h-[56px] border border-[#e5e5e5] rounded-[12px] px-5 flex items-center justify-between transition-all duration-300 focus-within:border-[#d45d00] focus-within:shadow-lg bg-white">

          <label htmlFor="search-task" className="sr-only">
            Rechercher une tâche
          </label>

          <input
            id="search-task"
            type="text"
            placeholder="Rechercher une tâche"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-[15px] sm:text-[16px] text-[#667085] outline-none"
          />

          <Search
            size={18}
            className="text-[#667085]"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) =>
            <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="py-10 text-center text-[#5f6670]">
            Aucune tâche assignée
          </div>
        )}
      </div>
    </div>
  );
}