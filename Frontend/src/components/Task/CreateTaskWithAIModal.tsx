"use client";

import { useState } from "react";
import { Sparkles, X, Trash2, Pencil, ChevronDown } from "lucide-react";
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
  const [userPrompt, setUserPrompt] = useState("");
  // Tâches générées par l'IA
  const [generatedTasks, setGeneratedTasks] = useState<Task[]>([]);
  // Indique si les tâches sont en cours de génération
  const [isGenerating, setIsGenerating] = useState(false);
  // Étape actuelle : saisie ou revue
  const [step, setStep] = useState<"input" | "review">("input");
  // Message d'erreur en cas de problème lors de la génération ou création des tâches
  const [error, setError] = useState<string | null>(null);
  // Tâche actuellement en cours d'édition
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Génération IA via API Route Next.js
  const handleGenerateTasks = async () => {
    if (!userPrompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Appel à l'API pour générer les tâches
      const response = await fetch("/api/generate-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Envoyer le prompt de l'utilisateur dans le corps de la requête
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        // En cas d'erreur, récupérer le message d'erreur depuis la réponse
        const errorData = await response.json();
        console.error(errorData);
        throw new Error(errorData.error || "Échec de la génération des tâches");
      }
// Récupération des tâches générées
      const { tasks } = await response.json();

      // Ajout d'un ID unique à chaque tâche
      const tasksWithId = tasks.map((task: any, index: number) => ({
        id: `ai-generated-${Date.now()}-${index}`,
        title: task.title,
        description: task.description,
        dueDate: "",
        status: "TODO",
        assigneeIds: [],
      }));

      setGeneratedTasks(tasksWithId);
      setStep("review");
    } catch (error) {
      console.error("Erreur :", error);
      setError("Impossible de générer les tâches. Veuillez réessayer.");
      setStep("review");
    } finally {
      setIsGenerating(false);
    }
  };

  // Création d'une tâche
  const handleCreateTask = async (task: Task) => {
    try {
      // Appel à l'API pour créer la tâche dans le projet
      await api.post(`/projects/${projectId}/tasks`, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        assigneeIds: task.assigneeIds || [],
        priority: "MEDIUM",
      });

      onTaskCreated();
    } catch (error) {
      console.error("Erreur lors de la création de la tâche :", error);
      setError("Échec de la création d'une tâche.");
    }
  };

  // Modifier une tâche générée
  const handleEditGeneratedTask = (updatedTask: Task) => {
    setGeneratedTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  // Supprimer une tâche générée avec confirmation
  const handleDeleteGeneratedTask = (id: string) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette tâche ?"
    );

    if (!confirmed) return;

    setGeneratedTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Ouvrir la modal d'édition
  const openEditModal = (task: Task) => {
    setEditingTask({ ...task });
  };

  // Fermer la modal d'édition
  const closeEditModal = () => {
    setEditingTask(null);
  };

  // Mettre à jour une tâche après édition
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto">
        <div className="relative flex h-[760px] max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[22px] bg-[#f8f8f8] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-8">
            <div className="flex items-center gap-2">
              <Sparkles
                size={18}
                className="fill-[#f97316] text-[#f97316]"
              />

              <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-[#202020]">
                {step === "input"
                  ? "Créer une tâche"
                  : "Vos tâches générées"}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-[#8c8c8c] transition hover:opacity-70"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex flex-1 flex-col px-8 pt-8 min-h-0">
            {/* Erreur */}
            {error && (
              <div className="mb-4 rounded-[10px] bg-[#fef2f2] p-3 text-[14px] text-[#dc2626]">
                {error}
              </div>
            )}

            {/* STEP INPUT */}
            {step === "input" && (
              <div className="flex h-full flex-col justify-between">
                <div className="flex-1" />

                <div className="mb-6">
                  <div className="flex items-center rounded-full bg-[#f1f1f1] px-6 py-4 shadow-sm">
                    <input
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                      className="flex-1 bg-transparent text-[13px] text-[#202020] outline-none placeholder:text-[#8f8f8f]"
                      disabled={isGenerating}
                    />

                    <button
                      onClick={handleGenerateTasks}
                      disabled={!userPrompt.trim() || isGenerating}
                      className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#d86109] text-white transition hover:scale-105 disabled:opacity-50"
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
                {/* Liste des tâches */}
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
                  <div className="space-y-3 pb-4">
                    {generatedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-[14px] border border-[#ececec] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                      >
                        <p className="text-[18px] font-semibold text-[#202020]">
                          {task.title}
                        </p>

                        <p className="mt-1 text-[15px] text-[#8b8b8b]">
                          {task.description}
                        </p>

                        {task.status && (
                          <div className="mt-3">
                            <span
                              className={`rounded-full px-3 py-1 text-[12px] ${
                                task.status === "TODO"
                                  ? "bg-[#fdecec] text-[#ef4444]"
                                  : task.status === "IN_PROGRESS"
                                  ? "bg-[#fff3e8] text-[#f59e0b]"
                                  : "bg-[#eaf8ef] text-[#22c55e]"
                              }`}
                            >
                              {task.status === "TODO"
                                ? "À faire"
                                : task.status === "IN_PROGRESS"
                                ? "En cours"
                                : "Terminée"}
                            </span>
                          </div>
                        )}

                        <div className="mt-5 flex items-center gap-4 text-[#8f8f8f]">
                          <button
                            onClick={() =>
                              handleDeleteGeneratedTask(task.id)
                            }
                            className="flex items-center gap-1 text-[13px] transition hover:text-black"
                          >
                            <Trash2 size={14} />
                            <span>Supprimer</span>
                          </button>

                          <div className="h-4 w-[1px] bg-[#d8d8d8]" />

                          <button
                            onClick={() => openEditModal(task)}
                            className="flex items-center gap-1 text-[13px] transition hover:text-black"
                          >
                            <Pencil size={14} />
                            <span>Modifier</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bouton ajouter */}
                <div className="flex justify-center py-6 shrink-0">
                  <button
                    onClick={handleCreateAllTasks}
                    className="rounded-[14px] bg-[#1f1f1f] px-7 py-4 text-[18px] font-medium text-white transition hover:opacity-90"
                  >
                    + Ajouter les tâches
                  </button>
                </div>

                {/* Input bas */}
                <div className="pb-6 shrink-0">
                  <div className="flex items-center rounded-full bg-[#f1f1f1] px-6 py-4 shadow-sm">
                    <input
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                      className="flex-1 bg-transparent text-[13px] text-[#202020] outline-none placeholder:text-[#8f8f8f]"
                      disabled={isGenerating}
                    />

                    <button
                      onClick={handleGenerateTasks}
                      disabled={!userPrompt.trim() || isGenerating}
                      className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#d86109] text-white transition hover:scale-105 disabled:opacity-50"
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

      {/* Modal d'édition */}
      {editingTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 overflow-y-auto">
          <div className="relative w-full max-w-[520px] rounded-[10px] bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={closeEditModal}
              className="absolute right-6 top-6 text-2xl text-gray-400 transition-all hover:text-black"
            >
              <X size={22} />
            </button>

            <h2 className="mb-10 text-[26px] text-[#1f1f1f]">
              Modifier une tâche
            </h2>

            <div className="space-y-7">
              <div>
                <label className="mb-3 block text-[16px] text-[#1f1f1f]">
                  Titre*
                </label>

                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev
                        ? {
                            ...prev,
                            title: e.target.value,
                          }
                        : null
                    )
                  }
                  className="h-[58px] w-full rounded-[12px] border border-[#e7e7e7] px-5 outline-none"
                />
              </div>

              <div>
                <label className="mb-3 block text-[16px] text-[#1f1f1f]">
                  Description*
                </label>

                <textarea
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev
                        ? {
                            ...prev,
                            description: e.target.value,
                          }
                        : null
                    )
                  }
                  className="min-h-[120px] w-full rounded-[12px] border border-[#e7e7e7] p-5 outline-none resize-none"
                />
              </div>

              <div>
                <label className="mb-3 block text-[16px] text-[#1f1f1f]">
                  Échéance*
                </label>

                <input
                  type="date"
                  value={editingTask.dueDate || ""}
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev
                        ? {
                            ...prev,
                            dueDate: e.target.value,
                          }
                        : null
                    )
                  }
                  className="h-[58px] w-full rounded-[12px] border border-[#e7e7e7] px-5 outline-none"
                />
              </div>

              <div>
                <label className="mb-3 block text-[16px] text-[#1f1f1f]">
                  Assigné à : *
                </label>

                <div className="rounded-[12px] border border-[#e7e7e7] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[#8b8f98]">
                      Choisir un ou plusieurs collaborateurs
                    </span>

                    <ChevronDown size={18} />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {members.map((member: any) => {
                      const isSelected =
                        editingTask.assigneeIds?.includes(
                          member.user.id
                        );

                      return (
                        <button
                          key={member.user.id}
                          type="button"
                          onClick={() =>
                            setEditingTask((prev: any) => {
                              if (!prev) return null;

                              const currentIds =
                                prev.assigneeIds || [];

                              return {
                                ...prev,
                                assigneeIds: currentIds.includes(
                                  member.user.id
                                )
                                  ? currentIds.filter(
                                      (id: string) =>
                                        id !== member.user.id
                                    )
                                  : [
                                      ...currentIds,
                                      member.user.id,
                                    ],
                              };
                            })
                          }
                          className={`rounded-full px-4 py-2 text-[14px] transition-all ${
                            isSelected
                              ? "bg-[#d45d00] text-white"
                              : "bg-[#f3f3f5] text-[#1f1f1f]"
                          }`}
                        >
                          {member.user.name || member.user.email}
                        </button>
                      );
                    })}
                  </div>

                  {(!editingTask.assigneeIds ||
                    editingTask.assigneeIds.length === 0) && (
                    <p className="mt-3 text-sm text-red-500">
                      Veuillez sélectionner au moins un collaborateur.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-4 block text-[16px] text-[#1f1f1f]">
                  Statut :
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              status: "TODO",
                            }
                          : null
                      )
                    }
                    className={`rounded-full px-5 py-2 text-[14px] ${
                      editingTask.status === "TODO"
                        ? "bg-[#ef4444] text-white"
                        : "bg-[#fdecec] text-[#ef4444]"
                    }`}
                  >
                    À faire
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              status: "IN_PROGRESS",
                            }
                          : null
                      )
                    }
                    className={`rounded-full px-5 py-2 text-[14px] ${
                      editingTask.status === "IN_PROGRESS"
                        ? "bg-[#f59e0b] text-white"
                        : "bg-[#fff3e8] text-[#f59e0b]"
                    }`}
                  >
                    En cours
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              status: "DONE",
                            }
                          : null
                      )
                    }
                    className={`rounded-full px-5 py-2 text-[14px] ${
                      editingTask.status === "DONE"
                        ? "bg-[#22c55e] text-white"
                        : "bg-[#eaf8ef] text-[#22c55e]"
                    }`}
                  >
                    Terminée
                  </button>
                </div>
              </div>

              <button
                onClick={handleUpdateTask}
                disabled={
                  !editingTask.assigneeIds ||
                  editingTask.assigneeIds.length === 0
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
          background: #d1d5db;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
}