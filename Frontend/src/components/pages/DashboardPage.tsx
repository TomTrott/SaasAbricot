"use client";

import { useEffect, useState, } from "react";
import { SquareCheckBig, KanbanSquare, } from "lucide-react";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import TaskListView from "../Dashboard/TaskListView";
import TaskKanbanView from "../Dashboard/TaskKanbanView";

import CreateProjectModal from "../Projects/CreateProjectModal";

export default function DashboardPage() {

  const [view, setView] =
    useState<"list" | "kanban">(
      "list"
    );

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  /**
   * LOAD USER
   */
  useEffect(() => {

    const loadUser = () => {

      const storedUser =
        localStorage.getItem(
          "user"
        );

      if (storedUser) {

        setUser(
          JSON.parse(storedUser)
        );

      } else {

        setUser(null);

      }
    };

    loadUser();

    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {

      window.removeEventListener(
        "storage",
        loadUser
      );
    };

  }, []);

  const refreshProjects = () => {

    window.location.reload();

  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f6f6]">

      <Navbar />

      {/* MAIN */}
      <main className="mx-auto w-full max-w-[1700px] flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-12 lg:px-14 xl:px-24">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          <div className="w-full">

            <h1 className="mb-2 text-[28px] font-bold leading-tight text-[#1f1f1f] sm:text-[32px] lg:text-[38px]">
              Tableau de bord
            </h1>

            <p className="text-[15px] leading-relaxed text-[#1f1f1f] sm:text-[17px] lg:text-[18px]">

              Bonjour{" "}

              <span className="font-semibold">

                {user?.name ||
                  user?.email ||
                  "Utilisateur"}

              </span>

              , voici un aperçu de vos projets et tâches

            </p>
          </div>

          {/* CREATE */}
          <button
            onClick={() =>
              setIsModalOpen(true)
            }
            className="h-[54px] w-full whitespace-nowrap rounded-[14px] bg-[#1f1f23] px-7 text-[16px] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black hover:shadow-xl active:scale-[0.98] sm:w-fit sm:text-[18px] lg:text-[20px]"
          >

            + Créer un projet

          </button>
        </div>

        {/* SWITCH */}
        <div className="mb-8 flex flex-wrap items-center gap-3">

          {/* LIST */}
          <button
            onClick={() =>
              setView("list")
            }
            className={`flex h-[48px] items-center gap-3 rounded-[12px] px-5 text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] sm:h-[50px] sm:px-6 sm:text-[17px] lg:text-[18px] ${
              view === "list"
                ? "bg-[#f7dfd1] text-[#d45d00] shadow-md"
                : "border border-[#ececec] bg-white text-[#d45d00] hover:bg-[#fff6f1]"
            }`}
          >

            <SquareCheckBig size={18} />

            Liste

          </button>

          {/* KANBAN */}
          <button
            onClick={() =>
              setView("kanban")
            }
            className={`flex h-[48px] items-center gap-3 rounded-[12px] px-5 text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] sm:h-[50px] sm:px-6 sm:text-[17px] lg:text-[18px] ${
              view === "kanban"
                ? "bg-[#f7dfd1] text-[#d45d00] shadow-md"
                : "border border-[#ececec] bg-white text-[#d45d00] hover:bg-[#fff6f1]"
            }`}
          >

            <KanbanSquare size={18} />

            Kanban

          </button>
        </div>

        {/* CONTENT */}
        {view === "list" ? (
          <TaskListView />
        ) : (
          <TaskKanbanView />
        )}

      </main>

      <Footer />

      {/* MODAL */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        onProjectCreated={
          refreshProjects
        }
      />
    </div>
  );
}