import { useState } from "react";
import { SquareCheckBig, KanbanSquare } from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import TaskListView from "../components/Dashboard/TaskListView";
import TaskKanbanView from "../components/Dashboard/TaskKanbanView";

export default function Dashboard() {
  const [view, setView] = useState<"list" | "kanban">("list");

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
      <Navbar />

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8 lg:px-14 xl:px-24 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
          <div className="w-full">
            <h1 className="text-[28px] sm:text-[32px] lg:text-[38px] font-bold text-[#1f1f1f] mb-2 leading-tight">
              Tableau de bord
            </h1>

            <p className="text-[15px] sm:text-[17px] lg:text-[18px] text-[#1f1f1f] leading-relaxed">
              Bonjour Alice Dupont, voici un aperçu de vos projets et tâches
            </p>
          </div>

          <button className="w-full sm:w-fit whitespace-nowrap bg-[#1f1f23] text-white h-[54px] px-7 rounded-[14px] text-[16px] sm:text-[18px] lg:text-[20px] font-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-black active:scale-[0.98]">
            + Créer un projet
          </button>
        </div>

        {/* SWITCH */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setView("list")}
            className={`h-[48px] sm:h-[50px] px-5 sm:px-6 rounded-[12px] flex items-center gap-3 text-[15px] sm:text-[17px] lg:text-[18px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] ${
              view === "list"
                ? "bg-[#f7dfd1] text-[#d45d00] shadow-md"
                : "bg-white border border-[#ececec] text-[#d45d00] hover:bg-[#fff6f1]"
            }`}
          >
            <SquareCheckBig size={18} />
            Liste
          </button>

          <button
            onClick={() => setView("kanban")}
            className={`h-[48px] sm:h-[50px] px-5 sm:px-6 rounded-[12px] flex items-center gap-3 text-[15px] sm:text-[17px] lg:text-[18px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] ${
              view === "kanban"
                ? "bg-[#f7dfd1] text-[#d45d00] shadow-md"
                : "bg-white border border-[#ececec] text-[#d45d00] hover:bg-[#fff6f1]"
            }`}
          >
            <KanbanSquare size={18} />
            Kanban
          </button>
        </div>

        {view === "list" ? <TaskListView /> : <TaskKanbanView />}
      </main>

      <Footer />
    </div>
  );
}