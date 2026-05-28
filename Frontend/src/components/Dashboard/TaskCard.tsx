"use client";

import { FolderClosed, Calendar, MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Task } from "./types";

// props pour taches
type Props = {
  task: Task;
};

// Configuration pour les statuts des tâches
const statusConfig = {
  TODO: {
    label: "À faire",
    className: "bg-[#ffe1e1] text-[#c62828]",
  },
  IN_PROGRESS: {
    label: "En cours",
    className: "bg-[#ffe8c7] text-[#a85a00]",
  },
  DONE: {
    label: "Terminée",
    className: "bg-[#ddf8e7] text-[#147a38]",
  },
};

export default function TaskCard({ task }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-[16px] border border-[#dcdcdc] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#cfcfcf] hover:shadow-2xl sm:p-6 lg:p-8">

      {/* Affichage du titre, de la description et du statut de la tâche */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold uppercase leading-tight text-[#1f1f1f] sm:text-[20px]">
            {task.title}
          </h3>

          <p className="mt-2 text-[14px] leading-relaxed text-[#5f6673] sm:text-[16px]">
            {task.description || "Aucune description"}
          </p>
        </div>

        <div
          className={`w-fit rounded-full px-4 py-1 text-[13px] font-semibold transition-all duration-300 hover:scale-105 sm:text-[15px] ${statusConfig[task.status].className}`}
        >
          {statusConfig[task.status].label}
        </div>
      </div>

      {/* Affichage des informations supplémentaires */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#5f6673] sm:text-[14px]">

          <div className="flex items-center gap-2">
            <FolderClosed
              size={16}
              aria-hidden="true"
              className="text-[#4b5563]"
            />

            <span>{task.project?.name}</span>
          </div>

          <div className="hidden sm:block text-[#4b5563]">
            |
          </div>

          <div className="flex items-center gap-2">
            <Calendar
              size={16}
              aria-hidden="true"
              className="text-[#4b5563]"
            />

            <span>
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })
                : "Pas de date"}
            </span>
          </div>

          <div className="hidden sm:block text-[#4b5563]">
            |
          </div>

          <div className="flex items-center gap-2">
            <MessageSquareText
              size={16}
              aria-hidden="true"
              className="text-[#4b5563]"
            />

            <span>{task.comments?.length || 0}</span>
          </div>
        </div>

        <button
          type="button"
          aria-label={`Voir le projet ${task.project?.name}`}
          onClick={() => router.push(`/projects/${task.project?.id}`)}
          className="h-[48px] w-full rounded-[12px] bg-[#1f1f23] text-[16px] font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black hover:shadow-lg active:scale-[0.97] lg:w-[140px] sm:text-[18px]"
        >
          Voir
        </button>
      </div>
    </div>
  );
}