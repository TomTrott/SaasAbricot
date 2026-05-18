"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  Search,
  Sparkles,
} from "lucide-react";

import api from "@/services/api";

import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import EditProjectModal from "../Projects/EditProjectModal";

export default function ProjectDetailsPage() {
  const router = useRouter();

  const params = useParams();

  const projectId = params.id;

  const [project, setProject] = useState<any>(null);

  const [tasks, setTasks] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  useEffect(() => {
    if (!projectId) return;

    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);

      const [projectRes, tasksRes] =
        await Promise.all([
          api.get(`/projects/${projectId}`),

          api.get(
            `/projects/${projectId}/tasks`
          ),
        ]);

      setProject(projectRes.data.data.project);

      setTasks(tasksRes.data.data.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (
    status: string
  ) => {
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

  const getStatusStyle = (
    status: string
  ) => {
    switch (status) {
      case "TODO":
        return "bg-[#fdecec] text-[#ef4444]";

      case "IN_PROGRESS":
        return "bg-[#fff3e8] text-[#f59e0b]";

      case "DONE":
        return "bg-[#eaf8ef] text-[#22c55e]";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <div className="text-[16px] text-[#8b8f98]">
          Chargement du projet...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <div className="text-[16px] text-[#8b8f98]">
          Projet introuvable
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8]">
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE */}
      <main className="flex-1 px-5 py-8 lg:px-10">
        {/* HEADER */}
        <div className="mb-10 flex items-start justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-start gap-5">
            {/* BACK */}
            <button
              onClick={() => router.back()}
              className="flex h-[58px] w-[58px] items-center justify-center rounded-[10px] border border-[#e7e7e7] bg-white transition-all hover:bg-[#fafafa]"
            >
              <ArrowLeft size={20} />
            </button>

            {/* PROJECT INFOS */}
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-[30px] font-semibold leading-none text-[#1f1f1f]">
                  {project.name}
                </h1>

                {/* BOUTON MODIFIER UNIQUEMENT SI ADMIN OU OWNER */}
                {(project.userRole === "OWNER" ||
                  project.userRole ===
                    "ADMIN") && (
                  <button
                    onClick={() =>
                      setIsEditModalOpen(true)
                    }
                    className="text-[15px] text-[#d45d00] transition-all hover:underline"
                  >
                    Modifier
                  </button>
                )}

                <EditProjectModal
                  isOpen={isEditModalOpen}
                  onClose={() =>
                    setIsEditModalOpen(false)
                  }
                  onProjectUpdated={
                    fetchProject
                  }
                  project={project}
                />
              </div>

              <p className="max-w-[900px] text-[18px] leading-relaxed text-[#8b8f98]">
                {project.description ||
                  "Aucune description"}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <button className="h-[52px] rounded-[10px] bg-[#1f1f1f] px-7 text-[16px] font-medium text-white transition-all hover:opacity-90">
              Créer une tâche
            </button>

            <button className="flex h-[52px] items-center gap-2 rounded-[16px] bg-[#d45d00] px-6 text-[16px] font-medium text-white transition-all hover:opacity-90">
              <Sparkles size={18} />

              <span>IA</span>
            </button>
          </div>
        </div>

        {/* CONTRIBUTORS */}
        <div className="mb-8 rounded-[10px] bg-[#f3f3f5] p-6">
          <div className="flex flex-wrap items-center justify-between gap-5">
            {/* TITLE */}
            <div className="flex items-center gap-3">
              <h2 className="text-[22px] font-semibold text-[#1f1f1f]">
                Contributeurs
              </h2>

              <span className="text-[16px] text-[#8b8f98]">
                {1 +
                  project.members.length}{" "}
                personnes
              </span>
            </div>

            {/* USERS */}
            <div className="flex flex-wrap items-center gap-3">
              {/* OWNER */}
              <div className="flex items-center gap-2">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#f5dfd2] text-[11px] uppercase text-[#1f1f1f]">
                  {project.owner?.name?.[0] ||
                    project.owner?.email?.[0]}
                </div>

                <div className="flex h-[30px] items-center justify-center rounded-full bg-[#fbe4d7] px-4 text-[14px] font-medium text-[#d45d00]">
                  Propriétaire
                </div>
              </div>

              {/* MEMBERS */}
              {project.members.map(
                (member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#ececf1] text-[11px] uppercase text-[#1f1f1f]">
                      {member.user?.name?.[0] ||
                        member.user
                          ?.email?.[0]}
                    </div>

                    <div className="flex h-[30px] items-center justify-center rounded-full bg-[#ececf1] px-4 text-[14px] text-[#6b7280]">
                      {member.user?.name ||
                        member.user?.email}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* TASKS CONTAINER */}
        <div className="rounded-[10px] border border-[#ececf1] bg-white p-8">
          {/* TASK HEADER */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
            {/* LEFT */}
            <div>
              <h2 className="mb-3 text-[22px] font-semibold leading-none text-[#1f1f1f]">
                Tâches
              </h2>

              <p className="text-[18px] text-[#8b8f98]">
                Par ordre de priorité
              </p>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-4">
              {/* VIEW */}
              <div className="flex items-center gap-2">
                <button className="flex h-[46px] items-center gap-2 rounded-[14px] bg-[#fbe4d7] px-5 text-[15px] font-medium text-[#d45d00]">
                  Liste
                </button>

                <button className="flex h-[46px] items-center gap-2 rounded-[14px] px-5 text-[15px] font-medium text-[#d45d00] transition-all hover:bg-[#fafafa]">
                  <Calendar size={16} />

                  Calendrier
                </button>
              </div>

              {/* STATUS */}
              <button className="flex h-[58px] min-w-[160px] items-center justify-between rounded-[16px] border border-[#e7e7e7] bg-white px-5 text-[16px] text-[#8b8f98]">
                <span>Statut</span>

                <ChevronDown size={18} />
              </button>

              {/* SEARCH */}
              <div className="flex h-[58px] w-[290px] items-center justify-between rounded-[16px] border border-[#e7e7e7] bg-white px-5">
                <input
                  type="text"
                  placeholder="Rechercher une tâche"
                  className="w-full bg-transparent text-[16px] outline-none placeholder:text-[#8b8f98]"
                />

                <Search
                  size={18}
                  className="text-[#8b8f98]"
                />
              </div>
            </div>
          </div>

          {/* TASKS */}
          <div className="space-y-5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-[10px] border border-[#ececf1] p-8"
              >
                {/* TOP */}
                <div className="mb-7 flex items-start justify-between gap-5">
                  {/* LEFT */}
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h3 className="text-[32px] font-medium leading-none text-[#1f1f1f]">
                        {task.title}
                      </h3>

                      <div
                        className={`flex h-[34px] items-center rounded-full px-4 text-[15px] font-medium ${getStatusStyle(
                          task.status
                        )}`}
                      >
                        {getStatusLabel(
                          task.status
                        )}
                      </div>
                    </div>

                    <p className="text-[20px] leading-relaxed text-[#8b8f98]">
                      {task.description ||
                        "Aucune description"}
                    </p>
                  </div>

                  {/* MENU */}
                  <button className="flex h-[58px] w-[58px] items-center justify-center rounded-[16px] border border-[#ececf1] transition-all hover:bg-[#fafafa]">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* DATE */}
                {task.dueDate && (
                  <div className="mb-6 flex items-center gap-2 text-[15px] text-[#8b8f98]">
                    <Calendar size={16} />

                    <span>
                      Échéance :{" "}
                      {new Date(
                        task.dueDate
                      ).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                        }
                      )}
                    </span>
                  </div>
                )}

                {/* ASSIGNEES */}
                {task.assignees?.length >
                  0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[15px] text-[#8b8f98]">
                      Assigné à :
                    </span>

                    {task.assignees.map(
                      (assignee: any) => (
                        <div
                          key={assignee.id}
                          className="flex items-center gap-2"
                        >
                          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#ececf1] text-[11px] uppercase">
                            {assignee.user
                              ?.name?.[0] ||
                              assignee.user
                                ?.email?.[0]}
                          </div>

                          <div className="flex h-[30px] items-center justify-center rounded-full bg-[#ececf1] px-4 text-[14px] text-[#6b7280]">
                            {assignee.user
                              ?.name ||
                              assignee.user
                                ?.email}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* COMMENTS */}
                <div className="mt-8 border-t border-[#ececf1] pt-6">
                  <button className="text-[16px] text-[#1f1f1f] transition-all hover:text-[#d45d00]">
                    Commentaires (0)
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {tasks.length === 0 && (
            <div className="py-16 text-center text-[16px] text-[#8b8f98]">
              Aucune tâche trouvée
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}