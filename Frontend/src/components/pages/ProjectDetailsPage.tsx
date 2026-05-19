"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// Icônes
import { ArrowLeft, Calendar, ChevronDown, MoreHorizontal, Search, Sparkles } from "lucide-react";
// Service API
import api from "@/services/api";

import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
// Modales
import EditProjectModal from "../Projects/EditProjectModal";
import CreateTaskModal from "../Task/CreateTaskModal";
import EditTaskModal from "../Task/EditTaskModal";
import TaskCard from "../Task/TaskCard";
import CreateTaskWithAIModal from "../Task/CreateTaskWithAIModal";

// --- COMPOSANT PRINCIPAL ---
export default function ProjectDetailsPage() {
  // --- HOOKS DE ROUTAGE ---
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  // --- ÉTATS (STATE) ---
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [openTaskMenu, setOpenTaskMenu] = useState<string | null>(null);
  // gestion modale IA
  const [isCreateTaskWithAIModalOpen, setIsCreateTaskWithAIModalOpen] = useState(false);

  // --- EFFET DE BORD (USEEFFECT) ---
  useEffect(() => {
    if (!projectId) return;
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/projects/${projectId}/tasks`),
      ]);
      setProject(projectRes.data.data.project);
      setTasks(tasksRes.data.data.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch = task.title?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" ? true : task.status === statusFilter;
      const matchDate = dateFilter === "" ? true : new Date(task.dueDate).toISOString().split("T")[0] === dateFilter;
      return matchSearch && matchStatus && matchDate;
    });
  }, [tasks, search, statusFilter, dateFilter]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]"><div className="text-[16px] text-[#8b8f98]">Chargement du projet...</div></div>;
  }

  if (!project) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]"><div className="text-[16px] text-[#8b8f98]">Projet introuvable</div></div>;
  }

  const handleDeleteProject = async () => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer ce projet ?");
    if (!confirmed) return;
    try {
      await api.delete(`/projects/${project.id}`);
      router.push("/projects");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsEditTaskModalOpen(true);
  };
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f8f8]">
      <Navbar />
      {/* Contenu principal */}
      <main className="flex-1 px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-5">
              <button onClick={() => router.back()} className="flex h-[58px] w-[58px] items-center justify-center rounded-[10px] border border-[#e7e7e7] bg-white transition-all hover:bg-[#fafafa]">
                <ArrowLeft size={20} />
              </button>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-4">
                  <h1 className="text-[30px] font-semibold leading-none text-[#1f1f1f]">{project.name}</h1>
                  {project.userRole === "ADMIN" && (
                    <>
                      <button onClick={() => setIsEditModalOpen(true)} className="text-[15px] text-[#d45d00] transition-all hover:underline">Modifier</button>
                      <button onClick={handleDeleteProject} className="text-[15px] text-red-500 transition-all hover:underline">Supprimer</button>
                    </>
                  )}
                  <EditProjectModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onProjectUpdated={fetchProject}
                    project={project}
                  />
                </div>
                <p className="max-w-[900px] text-[18px] leading-relaxed text-[#8b8f98]">{project.description || "Aucune description"}</p>
              </div>
            </div>
            {/* Actions principales */}
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => setIsCreateTaskModalOpen(true)} className="h-[52px] rounded-[10px] bg-[#1f1f1f] px-7 text-[16px] font-medium text-white transition-all hover:opacity-90">
                Créer une tâche
              </button>
              <button
                onClick={() => setIsCreateTaskWithAIModalOpen(true)}
                className="flex h-[52px] items-center gap-2 rounded-[16px] bg-[#d45d00] px-6 text-[16px] font-medium text-white transition-all hover:opacity-90"
              >
                <Sparkles size={18} />
                <span>IA</span>
              </button>
            </div>

            <CreateTaskWithAIModal
              isOpen={isCreateTaskWithAIModalOpen}
              onClose={() => setIsCreateTaskWithAIModalOpen(false)}
              projectId={projectId}
              onTaskCreated={fetchProject}
              members={[{ user: project.owner }, ...project.members]}
            />
            <CreateTaskModal
              isOpen={isCreateTaskModalOpen}
              onClose={() => setIsCreateTaskModalOpen(false)}
              projectId={project.id}
              members={[{ user: project.owner }, ...project.members]}
              onTaskCreated={fetchProject}
            />
            <EditTaskModal
              isOpen={isEditTaskModalOpen}
              onClose={() => setIsEditTaskModalOpen(false)}
              projectId={project.id}
              task={editingTask}
              members={[{ user: project.owner }, ...project.members]}
              onTaskUpdated={fetchProject}
            />
          </div>
          {/* Section des contributeurs */}
          <div className="mb-8 rounded-[18px] bg-[#f3f3f5] p-6">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <h2 className="text-[22px] font-semibold text-[#1f1f1f]">Contributeurs</h2>
                <span className="text-[16px] text-[#8b8f98]">{1 + project.members.length} personnes</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#f5dfd2] text-[11px] uppercase text-[#1f1f1f]">
                    {project.owner?.name?.[0] || project.owner?.email?.[0]}
                  </div>
                  <div className="flex h-[30px] items-center justify-center rounded-full bg-[#fbe4d7] px-4 text-[14px] font-medium text-[#d45d00]">
                    Propriétaire
                  </div>
                </div>
                {project.members.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#ececf1] text-[11px] uppercase text-[#1f1f1f]">
                      {member.user?.name?.[0] || member.user?.email?.[0]}
                    </div>
                    <div className="flex h-[30px] items-center justify-center rounded-full bg-[#ececf1] px-4 text-[14px] text-[#6b7280]">
                      {member.user?.name || member.user?.email}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Section des tâches */}
          <div className="rounded-[18px] border border-[#ececf1] bg-white p-6 sm:p-8">
            <div className="mb-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="mb-3 text-[22px] font-semibold leading-none text-[#1f1f1f]">Tâches</h2>
                <p className="text-[18px] text-[#8b8f98]">Par ordre de priorité</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-[58px] min-w-[180px] appearance-none rounded-[16px] border border-[#e7e7e7] bg-white px-5 pr-10 text-[16px] text-[#1f1f1f] outline-none"
                  >
                    <option value="ALL">Tous les statuts</option>
                    <option value="TODO">À faire</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="DONE">Terminée</option>
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8f98]" />
                </div>
                <div className="flex h-[58px] items-center rounded-[16px] border border-[#e7e7e7] bg-white px-5">
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-transparent text-[16px] outline-none"
                  />
                </div>
                <div className="flex h-[58px] w-full items-center justify-between rounded-[16px] border border-[#e7e7e7] bg-white px-5 sm:w-[290px]">
                  <input
                    type="text"
                    placeholder="Rechercher une tâche"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-[16px] outline-none placeholder:text-[#8b8f98]"
                  />
                  <Search size={18} className="text-[#8b8f98]" />
                </div>
              </div>
            </div>
            {/* Liste des tâches */}
            <div className="space-y-4 sm:space-y-5">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={project.id}
                  onTaskUpdated={fetchProject}
                  onEditTask={handleEditTask}
                  openTaskMenu={openTaskMenu}
                  setOpenTaskMenu={setOpenTaskMenu}
                />
              ))}
            </div>
            {filteredTasks.length === 0 && (
              <div className="py-16 text-center text-[16px] text-[#8b8f98]">Aucune tâche trouvée</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}