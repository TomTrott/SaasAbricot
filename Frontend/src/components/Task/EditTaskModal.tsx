"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronDown } from "lucide-react";
// Service API
import api from "@/services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  members: any[];
  task: any;
  onTaskUpdated: () => void;
}

export default function EditTaskModal({
  isOpen,
  onClose,
  projectId,
  members,
  task,
  onTaskUpdated,
}: Props) {
  // Permet de détecter les clics en dehors de la modale pour la fermer
  const modalRef = useRef<HTMLDivElement>(null);

  // États pour les champs du formulaire
  const [title, setTitle] = useState("");
  // Utilise une chaîne vide par défaut pour éviter les problèmes de champ contrôlé
  const [description, setDescription] = useState("");
  // Convertit date de la tâche en format YYYY-MM-DD
  const [dueDate, setDueDate] = useState("");
  // statut tâche par défaut
  const [status, setStatus] = useState("TODO");
  // Stocke les IDs des collaborateurs assignés à la tâche
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  // chargement
  const [loading, setLoading] = useState(false);

  // Initialise les champs avec les données de la tâche
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(
        task.dueDate
          ? new Date(task.dueDate)
              .toISOString()
              .split("T")[0]
          : ""
      );
      setStatus(task.status || "TODO");
      setAssigneeIds(
        task.assignees?.map((a: any) => a.user.id) || []
      );
    }
  }, [task]);

  // Ferme la modale si clic en dehors
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(
          event.target as Node
        )
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [onClose]);

  if (!isOpen) return null;

  const toggleAssignee = (id: string) => {
    setAssigneeIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // Met à jour la tâche via l'API
  const handleUpdateTask = async () => {
    if (assigneeIds.length === 0) {
      alert(
        "Veuillez attribuer la tâche à au moins un collaborateur."
      );
      return;
    }

    try {
      setLoading(true);

      await api.put(
        `/projects/${projectId}/tasks/${task.id}`,
        {
          title,
          description,
          dueDate,
          assigneeIds,
          priority: "MEDIUM",
          status,
        }
      );

      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-[520px] rounded-[10px] bg-white p-8 shadow-2xl"
      >
        {/* bouton fermer */}
        <button
          onClick={onClose}
          aria-label="Fermer la fenêtre"
          className="absolute right-6 top-6 text-2xl text-gray-500 transition-all hover:text-black"
        >
          <X size={22} />
        </button>

        {/* titre */}
        <h2 className="mb-10 text-[26px] font-semibold text-[#1f1f1f]">
          Modifier une tâche
        </h2>

        <div className="space-y-7">
          {/* titre */}
          <div>
            <label
              htmlFor="task-title"
              className="mb-3 block text-[16px] font-medium text-[#1f1f1f]"
            >
              Titre*
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="h-[58px] w-full rounded-[12px] border border-[#d1d5db] px-5 text-[#1f1f1f] outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* description */}
          <div>
            <label
              htmlFor="task-description"
              className="mb-3 block text-[16px] font-medium text-[#1f1f1f]"
            >
              Description*
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="min-h-[120px] w-full rounded-[12px] border border-[#d1d5db] p-5 text-[#1f1f1f] outline-none resize-none transition-all focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* échéance */}
          <div>
            <label
              htmlFor="task-due-date"
              className="mb-3 block text-[16px] font-medium text-[#1f1f1f]"
            >
              Échéance*
            </label>

            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              className="h-[58px] w-full rounded-[12px] border border-[#d1d5db] px-5 text-[#1f1f1f] outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* assignation */}
          <div>
            <label
              htmlFor="task-assignees"
              className="mb-3 block text-[16px] font-medium text-[#1f1f1f]"
            >
              Assigné à : *
            </label>

            <div
              id="task-assignees"
              className="rounded-[12px] border border-[#d1d5db] p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[#4b5563]">
                  Choisir un ou plusieurs collaborateurs
                </span>

                <ChevronDown
                  size={18}
                  className="text-[#4b5563]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {members.map((member: any) => {
                  const isSelected =
                    assigneeIds.includes(
                      member.user.id
                    );

                  return (
                    <button
                      key={member.user.id}
                      type="button"
                      onClick={() =>
                        toggleAssignee(
                          member.user.id
                        )
                      }
                      aria-pressed={isSelected}
                      className={`rounded-full px-4 py-2 text-[14px] font-medium transition-all ${
                        isSelected
                          ? "bg-[#b45309] text-white"
                          : "bg-[#e5e7eb] text-[#1f1f1f] hover:bg-[#d1d5db]"
                      }`}
                    >
                      {member.user.name ||
                        member.user.email}
                    </button>
                  );
                })}
              </div>

              {assigneeIds.length === 0 && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  Veuillez sélectionner au moins un collaborateur.
                </p>
              )}
            </div>
          </div>

          {/* statut */}
          <div>
            <label className="mb-4 block text-[16px] font-medium text-[#1f1f1f]">
              Statut :
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setStatus("TODO")}
                aria-pressed={status === "TODO"}
                className={`rounded-full px-5 py-2 text-[14px] font-medium transition-all ${
                  status === "TODO"
                    ? "bg-[#dc2626] text-white"
                    : "bg-[#fee2e2] text-[#b91c1c]"
                }`}
              >
                À faire
              </button>

              <button
                type="button"
                onClick={() =>
                  setStatus("IN_PROGRESS")
                }
                aria-pressed={
                  status === "IN_PROGRESS"
                }
                className={`rounded-full px-5 py-2 text-[14px] font-medium transition-all ${
                  status === "IN_PROGRESS"
                    ? "bg-[#d97706] text-white"
                    : "bg-[#fef3c7] text-[#b45309]"
                }`}
              >
                En cours
              </button>

              <button
                type="button"
                onClick={() => setStatus("DONE")}
                aria-pressed={status === "DONE"}
                className={`rounded-full px-5 py-2 text-[14px] font-medium transition-all ${
                  status === "DONE"
                    ? "bg-[#15803d] text-white"
                    : "bg-[#dcfce7] text-[#166534]"
                }`}
              >
                Terminée
              </button>
            </div>
          </div>

          {/* bouton */}
          <button
            onClick={handleUpdateTask}
            disabled={
              loading ||
              assigneeIds.length === 0
            }
            className="mt-6 h-[58px] rounded-[14px] bg-[#1f1f1f] px-8 text-[16px] font-medium text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Modification..."
              : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}