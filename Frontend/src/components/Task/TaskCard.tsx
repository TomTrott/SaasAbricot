"use client";

// React et hooks
import { useEffect, useState } from "react";

// Icônes
import {
  Calendar,
  MoreHorizontal,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Trash2,
  Pencil,
  X,
} from "lucide-react";

// Service API
import api from "@/services/api";

// Props pour le composant TaskCard
interface TaskCardProps {
  task: any;
  projectId: string;
  onTaskUpdated: () => void;
  onEditTask: (task: any) => void;
  openTaskMenu: string | null;
  setOpenTaskMenu: (taskId: string | null) => void;
}

// Interface commentaire
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "TODO":
      return "À faire";
    case "IN_PROGRESS":
      return "En cours";
    case "DONE":
      return "Terminée";
    default:
      return status;
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "TODO":
      return "bg-[#fdecec] text-[#c62828]";
    case "IN_PROGRESS":
      return "bg-[#fff3e8] text-[#b45309]";
    case "DONE":
      return "bg-[#eaf8ef] text-[#15803d]";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Composant principal
export default function TaskCard({
  task,
  projectId,
  onTaskUpdated,
  onEditTask,
  openTaskMenu,
  setOpenTaskMenu,
}: TaskCardProps) {
  // États commentaires
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // Commentaires de la tâche
  const [comments, setComments] = useState<Comment[]>([]);

  // Nouveau commentaire
  const [commentInput, setCommentInput] = useState("");

  // Indicateur de chargement
  const [loadingComment, setLoadingComment] = useState(false);

  // États édition commentaire
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState("");

  // Charger commentaires
  const fetchComments = async () => {
    try {
      const response = await api.get(
        `/projects/${projectId}/tasks/${task.id}/comments`
      );

      setComments(response.data.data.comments);
    } catch (error) {
      console.error(error);
    }
  };

  // Ouvrir/Fermer commentaires
  const toggleComments = async () => {
    if (!isCommentsOpen) {
      await fetchComments();
    }

    setIsCommentsOpen(!isCommentsOpen);
  };

  // Ajouter commentaire
  const handleCreateComment = async () => {
    if (!commentInput.trim()) return;

    try {
      setLoadingComment(true);

      await api.post(
        `/projects/${projectId}/tasks/${task.id}/comments`,
        {
          content: commentInput,
        }
      );

      setCommentInput("");
      fetchComments();
      onTaskUpdated();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingComment(false);
    }
  };

  // Supprimer commentaire
  const handleDeleteComment = async (commentId: string) => {
    const confirmed = window.confirm(
      "Voulez-vous supprimer ce commentaire ?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/projects/${projectId}/tasks/${task.id}/comments/${commentId}`
      );

      fetchComments();
      onTaskUpdated();
    } catch (error) {
      console.error(error);
    }
  };

  // Ouvrir modal édition
  const openEditModal = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  // Fermer modal édition
  const closeEditModal = () => {
    setEditingComment(null);
    setEditContent("");
  };

  // Modifier commentaire
  const handleUpdateComment = async () => {
    if (!editingComment) return;

    try {
      await api.put(
        `/projects/${projectId}/tasks/${task.id}/comments/${editingComment.id}`,
        {
          content: editContent,
        }
      );

      closeEditModal();
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  // Supprimer tâche
  const handleDeleteTask = async () => {
    const confirmed = window.confirm(
      "Voulez-vous supprimer cette tâche ?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${projectId}/tasks/${task.id}`);

      onTaskUpdated();
      setOpenTaskMenu(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="rounded-[16px] sm:rounded-[18px] border border-[#dcdfe4] p-4 sm:p-6 lg:p-8 bg-white transition-all duration-300 hover:shadow-xl">
        
        {/* HEADER */}
        <div className="mb-4 sm:mb-7">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            
            <div className="flex-1">
              
              {/* TITRE + STATUS */}
              <div className="mb-2 sm:mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
                
                <h3 className="text-[18px] sm:text-[24px] uppercase font-semibold leading-tight text-[#1f1f1f]">
                  {task.title}
                </h3>

                <div
                  className={`flex h-[28px] sm:h-[34px] items-center rounded-full px-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold ${getStatusStyle(
                    task.status
                  )}`}
                >
                  {getStatusLabel(task.status)}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="flex items-start justify-between gap-3">
                
                <p className="flex-1 text-[14px] sm:text-[16px] lg:text-[18px] leading-relaxed text-[#475467]">
                  {task.description || "Aucune description"}
                </p>

                {/* MENU */}
                <div className="relative flex-shrink-0">
                  
                  <button
                    type="button"
                    aria-label="Ouvrir le menu de la tâche"
                    onClick={() =>
                      setOpenTaskMenu(
                        openTaskMenu === task.id ? null : task.id
                      )
                    }
                    className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[#dcdfe4] text-[#344054] transition-all hover:bg-[#f9fafb]"
                  >
                    <MoreHorizontal size={16} aria-hidden="true" />
                  </button>

                  {openTaskMenu === task.id && (
                    <div className="absolute right-0 top-[50px] z-50 w-[190px] rounded-[14px] border border-[#dcdfe4] bg-white p-2 shadow-xl">
                      
                      <button
                        type="button"
                        onClick={() => {
                          onEditTask(task);
                          setOpenTaskMenu(null);
                        }}
                        className="flex h-[46px] w-full items-center rounded-[10px] px-4 text-left text-[15px] font-medium text-[#1f1f1f] transition-all hover:bg-[#f9fafb]"
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsCommentsOpen(true);
                          fetchComments();
                          setOpenTaskMenu(null);
                        }}
                        className="flex h-[46px] w-full items-center rounded-[10px] px-4 text-left text-[15px] font-medium text-[#1f1f1f] transition-all hover:bg-[#f9fafb]"
                      >
                        Commenter
                      </button>

                      <button
                        type="button"
                        onClick={handleDeleteTask}
                        className="flex h-[46px] w-full items-center rounded-[10px] px-4 text-left text-[15px] font-medium text-red-700 transition-all hover:bg-[#fef2f2]"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DATE */}
        {task.dueDate && (
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[13px] sm:text-[15px] text-[#475467]">
            <Calendar size={14} aria-hidden="true" />

            <span>
              Échéance :{" "}
              {new Date(task.dueDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* ASSIGNEES */}
        {task.assignees?.length > 0 && (
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2">
            
            <span className="text-[13px] sm:text-[15px] font-medium text-[#475467]">
              Assigné à :
            </span>

            {task.assignees.map((assignee: any) => (
              <div
                key={assignee.id}
                className="flex items-center gap-2"
              >
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#dfe3e8] text-[11px] font-semibold uppercase text-[#1f1f1f]">
                  {assignee.user?.name?.[0] ||
                    assignee.user?.email?.[0]}
                </div>

                <div className="hidden sm:flex h-[30px] items-center justify-center rounded-full bg-[#eceff3] px-4 text-[14px] font-medium text-[#374151]">
                  {assignee.user?.name || assignee.user?.email}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMMENTAIRES */}
        <div className="mt-6 sm:mt-8 border-t border-[#e4e7ec] pt-4 sm:pt-6">
          
          <button
            type="button"
            onClick={toggleComments}
            aria-expanded={isCommentsOpen}
            className="flex items-center gap-2 text-[14px] sm:text-[16px] font-medium text-[#1f1f1f] transition-all hover:text-[#b54700]"
          >
            <MessageSquare size={17} aria-hidden="true" />

            <span>
              Commentaires ({comments.length || task.comments?.length || 0})
            </span>

            {isCommentsOpen ? (
              <ChevronUp size={16} aria-hidden="true" />
            ) : (
              <ChevronDown size={16} aria-hidden="true" />
            )}
          </button>

          {/* SECTION COMMENTAIRES */}
          {isCommentsOpen && (
            <div className="mt-6">
              
              {/* LISTE */}
              <div className="max-h-[350px] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                
                {comments.length === 0 && (
                  <div className="rounded-[14px] border border-dashed border-[#cfd4dc] p-6 text-center text-[14px] text-[#475467]">
                    Aucun commentaire pour le moment
                  </div>
                )}

                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-[14px] border border-[#e4e7ec] bg-[#fafafa] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      
                      <div>
                        <p className="text-[14px] font-semibold text-[#1f1f1f]">
                          {comment.author.name ||
                            comment.author.email}
                        </p>

                        <p className="mt-1 text-[13px] text-[#475467]">
                          {new Date(
                            comment.createdAt
                          ).toLocaleString("fr-FR")}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        
                        <button
                          type="button"
                          aria-label="Modifier le commentaire"
                          onClick={() => openEditModal(comment)}
                          className="text-[#475467] transition hover:text-black"
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          aria-label="Supprimer le commentaire"
                          onClick={() =>
                            handleDeleteComment(comment.id)
                          }
                          className="text-[#475467] transition hover:text-red-700"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-[#344054]">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* INPUT */}
              <div className="mt-5 flex items-center gap-3">
                
                <label htmlFor={`comment-${task.id}`} className="sr-only">
                  Ajouter un commentaire
                </label>

                <input
                  id={`comment-${task.id}`}
                  type="text"
                  value={commentInput}
                  onChange={(e) =>
                    setCommentInput(e.target.value)
                  }
                  placeholder="Ajouter un commentaire..."
                  className="h-[54px] flex-1 rounded-[14px] border border-[#d0d5dd] bg-white px-5 text-[14px] text-[#1f1f1f] outline-none placeholder:text-[#667085] focus:border-[#b54700]"
                />

                <button
                  type="button"
                  aria-label="Envoyer le commentaire"
                  onClick={handleCreateComment}
                  disabled={
                    loadingComment || !commentInput.trim()
                  }
                  className="flex h-[54px] w-[54px] items-center justify-center rounded-[14px] bg-[#1f1f1f] text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDITION COMMENTAIRE */}
      {editingComment && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4">
          
          <div className="relative w-full max-w-[520px] rounded-[18px] bg-white p-8 shadow-2xl">
            
            <button
              type="button"
              aria-label="Fermer la fenêtre"
              onClick={closeEditModal}
              className="absolute right-6 top-6 text-[#475467] transition hover:text-black"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <h2 className="mb-8 text-[24px] font-semibold text-[#1f1f1f]">
              Modifier le commentaire
            </h2>

            <label
              htmlFor="edit-comment"
              className="mb-2 block text-[15px] font-medium text-[#1f1f1f]"
            >
              Contenu du commentaire
            </label>

            <textarea
              id="edit-comment"
              value={editContent}
              onChange={(e) =>
                setEditContent(e.target.value)
              }
              className="min-h-[180px] w-full resize-none rounded-[14px] border border-[#d0d5dd] p-5 text-[#1f1f1f] outline-none focus:border-[#b54700]"
            />

            <button
              type="button"
              onClick={handleUpdateComment}
              className="mt-6 h-[56px] rounded-[14px] bg-[#1f1f1f] px-8 text-[15px] font-medium text-white transition hover:opacity-90"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      )}

      {/* SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #98a2b3;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #667085;
        }
      `}</style>
    </>
  );
}