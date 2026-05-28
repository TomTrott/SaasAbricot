"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
// services API
import api from "@/services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  members: any[];
  onTaskCreated: () => void;
}

// Modal pour créer une nouvelle tâche
export default function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  members,
  onTaskCreated,
}: Props) {
  // États pour les champs du formulaire
  const [title, setTitle] = useState("");
  // Description de la tâche
  const [description, setDescription] = useState("");
  // Échéance au format ISO (YYYY-MM-DD)
  const [dueDate, setDueDate] = useState("");
  // Statut par défaut à "TODO"
  const [status, setStatus] = useState("TODO");
  // Tableau pour stocker les IDs des membres assignés à la tâche
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  // chargement lors de la création de la tâche
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Création de la tâche via l'API
  const handleCreateTask = async () => {
    if (assigneeIds.length === 0) {
      alert(
        "Veuillez attribuer la tâche à au moins un collaborateur."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        dueDate,
        assigneeIds,
        priority: "MEDIUM",
        status,
      });

      onTaskCreated();
      onClose();

      // Réinitialisation des champs
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("TODO");
      setAssigneeIds([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Bascule l'assignation d'un membre
  const toggleAssignee = (id: string) => {
    setAssigneeIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">
      <div className="relative w-full max-w-[520px] rounded-[10px] bg-white p-8 shadow-2xl">
        {/* bouton fermer */}
        <button
          onClick={onClose}
          aria-label="Fermer la fenêtre"
          className="absolute right-6 top-6 text-2xl text-gray-500 transition-all hover:text-black"
        >
          <X size={22} />
        </button>

        {/* titre */}
        <h2
          id="create-task-title"
          className="mb-10 text-[26px] font-medium text-[#1f1f1f]"
        >
          Créer une tâche
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
              onChange={(e) => setTitle(e.target.value)}
              className="h-[58px] w-full rounded-[12px] border border-[#d1d5db] px-5 text-[#1f1f1f] outline-none transition-all focus:border-black"
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
              className="min-h-[120px] w-full rounded-[12px] border border-[#d1d5db] p-5 text-[#1f1f1f] outline-none transition-all focus:border-black"
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
              className="h-[58px] w-full rounded-[12px] border border-[#d1d5db] px-5 text-[#1f1f1f] outline-none transition-all focus:border-black"
            />
          </div>

          {/* assignation */}
          <div>
            <label
              id="assignees-label"
              className="mb-3 block text-[16px] font-medium text-[#1f1f1f]"
            >
              Assigné à : *
            </label>

            <div
              role="group"
              aria-labelledby="assignees-label"
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
                    assigneeIds.includes(member.user.id);

                  return (
                    <button
                      key={member.user.id}
                      type="button"
                      onClick={() =>
                        toggleAssignee(member.user.id)
                      }
                      aria-pressed={isSelected}
                      className={`rounded-full px-4 py-2 text-[14px] font-medium transition-all ${
                        isSelected
                          ? "bg-[#d45d00] text-white"
                          : "bg-[#f3f4f6] text-[#1f1f1f] hover:bg-[#e5e7eb]"
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
                  Veuillez sélectionner au moins un
                  collaborateur.
                </p>
              )}
            </div>
          </div>

          {/* statut */}
          <div>
            <label
              id="task-status-label"
              className="mb-4 block text-[16px] font-medium text-[#1f1f1f]"
            >
              Statut :
            </label>

            <div
              role="group"
              aria-labelledby="task-status-label"
              className="flex flex-wrap items-center gap-3"
            >
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
            onClick={handleCreateTask}
            disabled={
              loading || assigneeIds.length === 0
            }
            className="mt-6 h-[58px] rounded-[14px] bg-[#1f1f1f] px-8 text-[16px] font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Création..."
              : "+ Ajouter une tâche"}
          </button>
        </div>
      </div>
    </div>
  );
}