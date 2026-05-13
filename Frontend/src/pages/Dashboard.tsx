import { useState } from "react";
import { SquareCheckBig, KanbanSquare, FolderClosed, Calendar, MessageSquareText, Search,} from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { tasks } from "../data/mockdata";

export default function Dashboard() {
  const [view, setView] = useState("list");

  const statusConfig = {
    TODO: {
      label: "À faire",
      className: "bg-[#ffe1e1] text-[#ff4d4d]",
    },

    IN_PROGRESS: {
      label: "En cours",
      className: "bg-[#ffe8c7] text-[#e28b00]",
    },

    DONE: {
      label: "Terminée",
      className: "bg-[#ddf8e7] text-[#1ca64c]",
    },
  };

  const TaskCard = ({ task }) => (
    <div className="border border-[#e7e7e7] rounded-[16px] p-8 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[20px] font-semibold text-[#1f1f1f]">
            {task.title}
          </h3>

          <p className="text-[16px] text-[#7f8792] mt-1">
            {task.description}
          </p>
        </div>

        <div
          className={`px-4 py-1 rounded-full text-[14px] font-medium ${
            statusConfig[task.status].className
          }`}
        >
          {statusConfig[task.status].label}
        </div>
      </div>

      {/* Infos */}
      <div className="flex items-center gap-4 text-[#8c93a1] text-[14px] mb-6">
        <div className="flex items-center gap-2">
          <FolderClosed size={16} />
          <span>{task.project}</span>
        </div>

        <span>|</span>

        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            {new Date(task.dueDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        <span>|</span>

        <div className="flex items-center gap-2">
          <MessageSquareText size={16} />
          <span>{task.comments}</span>
        </div>
      </div>

      <button className="w-[120px] h-[48px] bg-[#1f1f23] text-white rounded-[12px] text-[18px]">
        Voir
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
      <Navbar />

      <main className="flex-1 px-32 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-[34px] font-bold text-[#1f1f1f] mb-2">
              Tableau de bord
            </h1>

            <p className="text-[18px] text-[#1f1f1f]">
              Bonjour Alice Dupont, voici un aperçu de vos projets et tâches
            </p>
          </div>

          <button className="bg-[#1f1f23] text-white h-[56px] px-8 rounded-[14px] text-[20px] font-medium">
            + Créer un projet
          </button>
        </div>

        {/* Switch */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => setView("list")}
            className={`h-[50px] px-6 rounded-[12px] flex items-center gap-3 text-[18px]
            ${
              view === "list"
                ? "bg-[#f7dfd1] text-[#d45d00]"
                : "bg-white border border-[#ececec] text-[#d45d00]"
            }`}
          >
            <SquareCheckBig size={18} />
            Liste
          </button>

          <button
            onClick={() => setView("kanban")}
            className={`h-[50px] px-6 rounded-[12px] flex items-center gap-3 text-[18px]
            ${
              view === "kanban"
                ? "bg-[#f7dfd1] text-[#d45d00]"
                : "bg-white border border-[#ececec] text-[#d45d00]"
            }`}
          >
            <KanbanSquare size={18} />
            Kanban
          </button>
        </div>

        {/* ================= LIST VIEW ================= */}
        {view === "list" && (
          <div className="bg-white border border-[#e7e7e7] rounded-[18px] p-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-[28px] font-bold text-[#1f1f1f]">
                  Mes tâches assignées
                </h2>

                <p className="text-[18px] text-[#8a8f98] mt-1">
                  Par ordre de priorité
                </p>
              </div>

              {/* Search */}
              <div className="w-[340px] h-[58px] border border-[#e5e5e5] rounded-[12px] px-5 flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Rechercher une tâche"
                  className="w-full outline-none text-[16px] text-[#667085] bg-transparent"
                />

                <Search
                  size={18}
                  className="text-[#667085]"
                />
              </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-5">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= KANBAN VIEW ================= */}
        {view === "kanban" && (
          <div className="grid grid-cols-3 gap-6">
            {/* TODO */}
            <div className="border border-[#ffd9d9] rounded-[18px] p-6">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-[22px] font-semibold">
                  À faire
                </h2>

                <div className="bg-[#e5e7eb] text-[#6b7280] px-4 py-1 rounded-full text-[14px]">
                  {
                    tasks.filter(
                      (task) => task.status === "TODO"
                    ).length
                  }
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {tasks
                  .filter((task) => task.status === "TODO")
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                    />
                  ))}
              </div>
            </div>

            {/* IN_PROGRESS */}
            <div className="border border-[#ffe8c7] rounded-[18px] p-6">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-[22px] font-semibold">
                  En cours
                </h2>

                <div className="bg-[#e5e7eb] text-[#6b7280] px-4 py-1 rounded-full text-[14px]">
                  {
                    tasks.filter(
                      (task) => task.status === "IN_PROGRESS"
                    ).length
                  }
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {tasks
                  .filter(
                    (task) => task.status === "IN_PROGRESS"
                  )
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                    />
                  ))}
              </div>
            </div>

            {/* DONE */}
            <div className="border border-[#ddf8e7] rounded-[18px] p-6">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-[22px] font-semibold">
                  Terminées
                </h2>

                <div className="bg-[#e5e7eb] text-[#6b7280] px-4 py-1 rounded-full text-[14px]">
                  {
                    tasks.filter(
                      (task) => task.status === "DONE"
                    ).length
                  }
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {tasks
                  .filter((task) => task.status === "DONE")
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}