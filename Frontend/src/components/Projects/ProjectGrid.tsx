"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import ProjectCard from "./ProjectCard";
// Composant pour afficher une grille de projets avec leurs tâches associées
export default function ProjectGrid() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupère tous les projets avec leurs tâches associées
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/projects");

      // Pour chaque projet, récupère ses tâches
      const projectsWithTasks = await Promise.all(
        response.data.data.projects.map(async (project: any) => {
          try {
            const tasksResponse = await api.get(`/projects/${project.id}/tasks`);
            return { ...project, tasks: tasksResponse.data.data.tasks };
          } catch (error) {
            return { ...project, tasks: [] };
          }
        })
      );
      setProjects(projectsWithTasks);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Chargement des projets...</div>;
  }

  if (projects.length === 0) {
    return <div className="bg-white border border-[#e7e7e7] rounded-[18px] p-10 text-center text-[#8b8f98]">Aucun projet trouvé</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Affiche une grille de cartes de projets */}
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}