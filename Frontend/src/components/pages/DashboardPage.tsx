"use client";

import { useEffect, useState } from "react";
import { SquareCheckBig, KanbanSquare } from "lucide-react";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import TaskListView from "../Dashboard/TaskListView";
import TaskKanbanView from "../Dashboard/TaskKanbanView";
import CreateProjectModal from "../Projects/CreateProjectModal";

export default function DashboardPage() {
  // État pour la vue sélectionnée (liste ou kanban)
  const [view, setView] = useState<"list" | "kanban">("list");
  // État pour le modal de création de projet
  const [isModalOpen, setIsModalOpen] = useState(false);
  // État pour stocker les informations de l'utilisateur
  const [user, setUser] = useState<any>(null);

  // Charge l'utilisateur depuis le localStorage
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(null);
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // Rafraîchit la page après création d'un projet
  const refreshProjects = () => window.location.reload();

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f6f6]">
      <Navbar />
      {/* Contenu principal du tableau de bord */}
      <main className="mx-auto w-full max-w-[1700px] flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-12 lg:px-14 xl:px-24">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full">
            {/* Titre */}
            <h1 className="mb-2 text-[28px] font-bold leading-tight text-[#1f1f1f] sm:text-[32px] lg:text-[38px]">
              Tableau de bord
            </h1>
            <p className="text-[15px] leading-relaxed text-[#1f1f1f] sm:text-[17px] lg:text-[18px]">
              Bonjour{" "}
              <span className="font-semibold" aria-label="Nom de l'utilisateur">
                {user?.name || user?.email || "Utilisateur"}
              </span>
              , voici un aperçu de vos projets et tâches.
            </p>
          </div>
          {/* Bouton */}
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Créer un nouveau projet"
            className="h-[54px] w-full whitespace-nowrap rounded-[14px] bg-[#1f1f23] px-7 text-[16px] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2 sm:w-fit sm:text-[18px] lg:text-[20px]"
          >
            Créer un projet
          </button>
        </div>

        {/* Boutons de sélection de la vue */}
        <div className="mb-8 flex flex-wrap items-center gap-3" role="group" aria-label="Choix de l'affichage">
          <button
            onClick={() => setView("list")}
            aria-label="Afficher en mode liste"
            aria-pressed={view === "list"}
            className={`flex h-[48px] items-center gap-3 rounded-[12px] px-5 text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[#d45d00] sm:h-[50px] sm:px-6 sm:text-[17px] lg:text-[18px] ${view === "list" ? "bg-[#f7dfd1] text-[#a04000] shadow-md" : "border border-[#ececec] bg-white text-[#a04000] hover:bg-[#fff6f1]"
              }`}
          >
            <SquareCheckBig size={18} aria-hidden="true" />
            Liste
          </button>
          <button
            onClick={() => setView("kanban")}
            aria-label="Afficher en mode Kanban"
            aria-pressed={view === "kanban"}
            className={`flex h-[48px] items-center gap-3 rounded-[12px] px-5 text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[#d45d00] sm:h-[50px] sm:px-6 sm:text-[17px] lg:text-[18px] ${view === "kanban" ? "bg-[#f7dfd1] text-[#a04000] shadow-md" : "border border-[#ececec] bg-white text-[#a04000] hover:bg-[#fff6f1]"
              }`}
          >
            <KanbanSquare size={18} aria-hidden="true" />
            Kanban
          </button>
        </div>

        {/* Affichage conditionnel des vues */}
        <div aria-live="polite">
          {view === "list" ? <TaskListView /> : <TaskKanbanView />}
        </div>
      </main>

      <Footer />
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={refreshProjects}
      />
    </div>
  );
}