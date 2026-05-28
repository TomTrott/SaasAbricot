"use client";

import { useState } from "react";
import {
  Sparkles,
  X,
  Trash2,
  Pencil,
  ChevronDown,
} from "lucide-react";
import api from "@/services/api";
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  status?: string;
  assigneeIds?: string[];
}
interface CreateTaskWithAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onTaskCreated: () => void;
  members: any[];
}

export default function CreateTaskWithAIModal({
  isOpen,
  onClose,
  projectId,
  onTaskCreated,
  members,
}: CreateTaskWithAIModalProps) {
  // États locaux
  const [userPrompt, setUserPrompt] =
    useState("");
  // Tâches générées par l'IA
  const [generatedTasks, setGeneratedTasks] =
    useState<Task[]>([]);
  // Indique si les tâches sont en cours de génération
  const [isGenerating, setIsGenerating] =
    useState(false);
  // Étape actuelle : saisie ou revue
  const [step, setStep] = useState<
    "input" | "review"
  >("input");
  // Message d'erreur
  const [error, setError] = useState<
    string | null
  >(null);
  // Tâche actuellement en cours d'édition
  const [editingTask, setEditingTask] =
    useState<Task | null>(null);
  // Génération IA via API Route Next.js
  const handleGenerateTasks = async () => {
    if (!userPrompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      // Appel API
      const response = await fetch(
        "/api/generate-tasks",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            prompt: userPrompt,
          }),
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json();
        console.error(errorData);
        throw new Error(
          errorData.error ||
            "Échec de la génération des tâches"
        );
      }

      // Récupération des tâches générées
      const { tasks } =
        await response.json();

      // Ajout ID unique
      const tasksWithId = tasks.map(
        (task: any, index: number) => ({
          id: `ai-generated-${Date.now()}-${index}`,
          title: task.title,
          description: task.description,
          dueDate: "",
          status: "TODO",
          assigneeIds: [],
        })
      );

      setGeneratedTasks(tasksWithId);
      setStep("review");
    } catch (error) {
      console.error("Erreur :", error);

      setError(
        "Impossible de générer les tâches. Veuillez réessayer."
      );

      setStep("review");
    } finally {
      setIsGenerating(false);
    }
  };

  // Création d'une tâche
  const handleCreateTask = async (
    task: Task
  ) => {
    try {
      await api.post(
        `/projects/${projectId}/tasks`,
        {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
          assigneeIds:
            task.assigneeIds || [],
          priority: "MEDIUM",
        }
      );

      onTaskCreated();
    } catch (error) {
      console.error(
        "Erreur lors de la création de la tâche :",
        error
      );

      setError(
        "Échec de la création d'une tâche."
      );
    }
  };

  // Modifier tâche générée
  const handleEditGeneratedTask = (
    updatedTask: Task
  ) => {
    setGeneratedTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );
  };

  // Supprimer tâche générée
  const handleDeleteGeneratedTask = (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette tâche ?"
    );

    if (!confirmed) return;

    setGeneratedTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  // Ouvrir modal édition
  const openEditModal = (task: Task) => {
    setEditingTask({ ...task });
  };

  // Fermer modal édition
  const closeEditModal = () => {
    setEditingTask(null);
  };

  // Sauvegarder édition
  const handleUpdateTask = () => {
    if (!editingTask) return;

    handleEditGeneratedTask(editingTask);
    closeEditModal();
  };

  // Ajouter toutes les tâches
  const handleCreateAllTasks = async () => {
    for (const task of generatedTasks) {
      await handleCreateTask(task);
    }

    setGeneratedTasks([]);
    setUserPrompt("");
    setStep("input");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal principale */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4">
        <div className="relative flex h-[760px] max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[22px] bg-[#f8f8f8] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-8">
            <div className="flex items-center gap-2">
              <Sparkles
                size={18}
                className="fill-[#ea580c] text-[#ea580c]"
              />

              <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-[#202020]">
                {step === "input"
                  ? "Créer une tâche"
                  : "Vos tâches générées"}
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className="text-[#6b7280] transition hover:opacity-70"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex min-h-0 flex-1 flex-col px-8 pt-8">
            {/* erreur */}
            {error && (
              <div className="mb-4 rounded-[10px] bg-[#fef2f2] p-3 text-[14px] font-medium text-[#b91c1c]">
                {error}
              </div>
            )}

            {/* STEP INPUT */}
            {step === "input" && (
              <div className="flex h-full flex-col justify-between">
                <div className="flex-1" />

                <div className="mb-6">
                  <label
                    htmlFor="ai-task-prompt"
                    className="mb-3 block text-[15px] font-medium text-[#1f1f1f]"
                  >
                    Décrivez les tâches à générer
                  </label>

                  <div className="flex items-center rounded-full bg-[#f1f1f1] px-6 py-4 shadow-sm">
                    <input
                      id="ai-task-prompt"
                      value={userPrompt}
                      onChange={(e) =>
                        setUserPrompt(
                          e.target.value
                        )
                      }
                      placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                      className="flex-1 bg-transparent text-[14px] text-[#202020] outline-none placeholder:text-[#6b7280]"
                      disabled={isGenerating}
                    />

                    <button
                      onClick={
                        handleGenerateTasks
                      }
                      aria-label="Générer des tâches avec l’IA"
                      disabled={
                        !userPrompt.trim() ||
                        isGenerating
                      }
                      className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#c2410c] text-white transition hover:scale-105 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                      ) : (
                        <Sparkles size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP REVIEW */}
            {step === "review" && (
              <div className="flex h-full min-h-0 flex-col">
                {/* liste */}
                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
                  <div className="space-y-3 pb-4">
                    {generatedTasks.map(
                      (task) => (
                        <div
                          key={task.id}
                          className="rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                        >
                          <p className="text-[18px] font-semibold text-[#202020]">
                            {task.title}
                          </p>

                          <p className="mt-1 text-[15px] leading-relaxed text-[#4b5563]">
                            {task.description}
                          </p>

                          {task.status && (
                            <div className="mt-3">
                              <span
                                className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                                  task.status ===
                                  "TODO"
                                    ? "bg-[#fee2e2] text-[#b91c1c]"
                                    : task.status ===
                                      "IN_PROGRESS"
                                    ? "bg-[#fef3c7] text-[#b45309]"
                                    : "bg-[#dcfce7] text-[#166534]"
                                }`}
                              >
                                {task.status ===
                                "TODO"
                                  ? "À faire"
                                  : task.status ===
                                    "IN_PROGRESS"
                                  ? "En cours"
                                  : "Terminée"}
                              </span>
                            </div>
                          )}

                          <div className="mt-5 flex items-center gap-4 text-[#4b5563]">
                            <button
                              onClick={() =>
                                handleDeleteGeneratedTask(
                                  task.id
                                )
                              }
                              className="flex items-center gap-1 text-[13px] transition hover:text-black"
                            >
                              <Trash2
                                size={14}
                              />

                              <span>
                                Supprimer
                              </span>
                            </button>

                            <div className="h-4 w-[1px] bg-[#9ca3af]" />

                            <button
                              onClick={() =>
                                openEditModal(
                                  task
                                )
                              }
                              className="flex items-center gap-1 text-[13px] transition hover:text-black"
                            >
                              <Pencil
                                size={14}
                              />

                              <span>
                                Modifier
                              </span>
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* bouton */}
                <div className="shrink-0 py-6">
                  <button
                    onClick={
                      handleCreateAllTasks
                    }
                    className="rounded-[14px] bg-[#1f1f1f] px-7 py-4 text-[18px] font-medium text-white transition hover:opacity-90"
                  >
                    + Ajouter les tâches
                  </button>
                </div>

                {/* input bas */}
                <div className="shrink-0 pb-6">
                  <label
                    htmlFor="review-task-prompt"
                    className="mb-3 block text-[15px] font-medium text-[#1f1f1f]"
                  >
                    Générer d'autres tâches
                  </label>

                  <div className="flex items-center rounded-full bg-[#f1f1f1] px-6 py-4 shadow-sm">
                    <input
                      id="review-task-prompt"
                      value={userPrompt}
                      onChange={(e) =>
                        setUserPrompt(
                          e.target.value
                        )
                      }
                      placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                      className="flex-1 bg-transparent text-[14px] text-[#202020] outline-none placeholder:text-[#6b7280]"
                      disabled={isGenerating}
                    />

                    <button
                      onClick={
                        handleGenerateTasks
                      }
                      aria-label="Regénérer des tâches"
                      disabled={
                        !userPrompt.trim() ||
                        isGenerating
                      }
                      className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#c2410c] text-white transition hover:scale-105 disabled:opacity-50"
                    >
                      <Sparkles size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal édition */}
      {editingTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/30 px-4">
          <div className="custom-scrollbar relative max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[10px] bg-white p-8 shadow-2xl">
            <button
              onClick={closeEditModal}
              aria-label="Fermer la fenêtre d’édition"
              className="absolute right-6 top-6 text-2xl text-gray-500 transition-all hover:text-black"
            >
              <X size={22} />
            </button>

            <h2 className="mb-10 text-[26px] font-medium text-[#1f1f1f]">
              Modifier une tâche
            </h2>

            <div className="space-y-7">
              {/* titre */}
              <div>
                <label
                  htmlFor="edit-task-title"
                  className="mb-3 block text-[16px] font-medium text-[#1f1f1f]"
                >
                  Titre*
                </label>

                <input
                  id="edit-task-title"
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev
                        ? {
                            ...prev,
                            title:
                              e.target.value,
                          }
                        : null
                    )
                  }
                  className="h-[58px] w-full rounded-[12px] border border-[#d1d5db] px-5 text-[#1f1f1f] outline-none"
                />
              </div>

              {/* description */}
              <div>
                <label
                  htmlFor="edit-task-description"
                  className="mb-3 block text-[16px] font-medium text-[#1f1f1f]"
                >
                  Description*
                </label>

                <textarea
                  id="edit-task-description"
                  value={
                    editingTask.description
                  }
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev
                        ? {
                            ...prev,
                            description:
                              e.target.value,
                          }
                        : null
                    )
                  }
                  className="min-h-[120px] w-full resize-none rounded-[12px] border border-[#d1d5db] p-5 text-[#1f1f1f] outline-none"
                />
              </div>

              {/* échéance */}
              <div>
                <label
                  htmlFor="edit-task-due-date"
                  className="mb-3 block text-[16px] font-medium text-[#1f1f1f]"
                >
                  Échéance*
                </label>

                <input
                  id="edit-task-due-date"
                  type="date"
                  value={
                    editingTask.dueDate ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev
                        ? {
                            ...prev,
                            dueDate:
                              e.target.value,
                          }
                        : null
                    )
                  }
                  className="h-[58px] w-full rounded-[12px] border border-[#d1d5db] px-5 text-[#1f1f1f] outline-none"
                />
              </div>

              {/* assignés */}
              <div>
                <label
                  id="edit-assignees-label"
                  className="mb-3 block text-[16px] font-medium text-[#1f1f1f]"
                >
                  Assigné à : *
                </label>

                <div
                  role="group"
                  aria-labelledby="edit-assignees-label"
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
                    {members.map(
                      (member: any) => {
                        const isSelected =
                          editingTask.assigneeIds?.includes(
                            member.user.id
                          );

                        return (
                          <button
                            key={
                              member.user.id
                            }
                            type="button"
                            aria-pressed={
                              isSelected
                            }
                            onClick={() =>
                              setEditingTask(
                                (
                                  prev: any
                                ) => {
                                  if (!prev)
                                    return null;

                                  const currentIds =
                                    prev.assigneeIds ||
                                    [];

                                  return {
                                    ...prev,
                                    assigneeIds:
                                      currentIds.includes(
                                        member.user
                                          .id
                                      )
                                        ? currentIds.filter(
                                            (
                                              id: string
                                            ) =>
                                              id !==
                                              member
                                                .user
                                                .id
                                          )
                                        : [
                                            ...currentIds,
                                            member
                                              .user
                                              .id,
                                          ],
                                  };
                                }
                              )
                            }
                            className={`rounded-full px-4 py-2 text-[14px] font-medium transition-all ${
                              isSelected
                                ? "bg-[#c2410c] text-white"
                                : "bg-[#f3f4f6] text-[#1f1f1f]"
                            }`}
                          >
                            {member.user.name ||
                              member.user.email}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {(!editingTask.assigneeIds ||
                    editingTask.assigneeIds
                      .length === 0) && (
                    <p className="mt-3 text-sm font-medium text-red-600">
                      Veuillez sélectionner
                      au moins un
                      collaborateur.
                    </p>
                  )}
                </div>
              </div>

              {/* statut */}
              <div>
                <label
                  id="edit-status-label"
                  className="mb-4 block text-[16px] font-medium text-[#1f1f1f]"
                >
                  Statut :
                </label>

                <div
                  role="group"
                  aria-labelledby="edit-status-label"
                  className="flex flex-wrap items-center gap-3"
                >
                  <button
                    type="button"
                    aria-pressed={
                      editingTask.status ===
                      "TODO"
                    }
                    onClick={() =>
                      setEditingTask(
                        (prev) =>
                          prev
                            ? {
                                ...prev,
                                status:
                                  "TODO",
                              }
                            : null
                      )
                    }
                    className={`rounded-full px-5 py-2 text-[14px] font-medium ${
                      editingTask.status ===
                      "TODO"
                        ? "bg-[#dc2626] text-white"
                        : "bg-[#fee2e2] text-[#b91c1c]"
                    }`}
                  >
                    À faire
                  </button>

                  <button
                    type="button"
                    aria-pressed={
                      editingTask.status ===
                      "IN_PROGRESS"
                    }
                    onClick={() =>
                      setEditingTask(
                        (prev) =>
                          prev
                            ? {
                                ...prev,
                                status:
                                  "IN_PROGRESS",
                              }
                            : null
                      )
                    }
                    className={`rounded-full px-5 py-2 text-[14px] font-medium ${
                      editingTask.status ===
                      "IN_PROGRESS"
                        ? "bg-[#d97706] text-white"
                        : "bg-[#fef3c7] text-[#b45309]"
                    }`}
                  >
                    En cours
                  </button>

                  <button
                    type="button"
                    aria-pressed={
                      editingTask.status ===
                      "DONE"
                    }
                    onClick={() =>
                      setEditingTask(
                        (prev) =>
                          prev
                            ? {
                                ...prev,
                                status:
                                  "DONE",
                              }
                            : null
                      )
                    }
                    className={`rounded-full px-5 py-2 text-[14px] font-medium ${
                      editingTask.status ===
                      "DONE"
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
                  !editingTask.assigneeIds ||
                  editingTask.assigneeIds
                    .length === 0
                }
                className="mt-6 h-[58px] rounded-[14px] bg-[#1f1f1f] px-8 text-[16px] font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </>
  );
}