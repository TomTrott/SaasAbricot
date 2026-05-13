// TaskCard.tsx
import { FolderClosed, Calendar, MessageSquareText, } from "lucide-react";
import type { Task } from "./types";

type Props = {
  task: Task;
};

const statusConfig = {
  TODO: {
    label: "À faire",
    className:
      "bg-[#ffe1e1] text-[#ff4d4d]",
  },

  IN_PROGRESS: {
    label: "En cours",
    className:
      "bg-[#ffe8c7] text-[#e28b00]",
  },

  DONE: {
    label: "Terminée",
    className:
      "bg-[#ddf8e7] text-[#1ca64c]",
  },
};

export default function TaskCard({
  task,
}: Props) {
  return (
    <div
      className="
        border
        border-[#e7e7e7]
        rounded-[16px]
        p-5
        sm:p-6
        lg:p-8
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        hover:border-[#d9d9d9]
      "
    >
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-start
          lg:justify-between
          gap-4
          mb-5
        "
      >
        <div className="flex-1">
          <h3
            className="
              text-[18px]
              sm:text-[20px]
              font-semibold
              text-[#1f1f1f]
              leading-tight
            "
          >
            {task.title}
          </h3>

          <p
            className="
              text-[14px]
              sm:text-[16px]
              text-[#7f8792]
              mt-2
              leading-relaxed
            "
          >
            {task.description}
          </p>
        </div>

        <div
          className={`
            w-fit
            px-4
            py-1
            rounded-full
            text-[13px]
            sm:text-[14px]
            font-medium
            transition-all
            duration-300
            hover:scale-105
            ${statusConfig[task.status].className}
          `}
        >
          {statusConfig[task.status].label}
        </div>
      </div>

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
          text-[#8c93a1]
          text-[13px]
          sm:text-[14px]
          mb-6
        "
      >
        <div className="flex items-center gap-2">
          <FolderClosed size={16} />
          <span>{task.project}</span>
        </div>

        <div className="hidden sm:block">|</div>

        <div className="flex items-center gap-2">
          <Calendar size={16} />

          <span>
            {new Date(
              task.dueDate
            ).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        <div className="hidden sm:block">|</div>

        <div className="flex items-center gap-2">
          <MessageSquareText size={16} />
          <span>{task.comments}</span>
        </div>
      </div>

      <button
        className="
          w-full
          sm:w-[140px]
          h-[48px]
          bg-[#1f1f23]
          text-white
          rounded-[12px]
          text-[16px]
          sm:text-[18px]
          transition-all
          duration-300
          hover:bg-black
          hover:shadow-lg
          hover:scale-[1.02]
          active:scale-[0.97]
        "
      >
        Voir
      </button>
    </div>
  );
}