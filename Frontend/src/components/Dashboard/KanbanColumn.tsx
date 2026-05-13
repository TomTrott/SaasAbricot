import TaskCard from "./TaskCard";
import type { Task } from "./types";

type Props = {
  title: string;
  tasks: Task[];
  borderColor: string;
};

export default function KanbanColumn({
  title,
  tasks,
  borderColor,
}: Props) {
  return (
    <div
      className={`
        rounded-[18px]
        p-4
        sm:p-5
        lg:p-6
        border
        bg-white
        transition-all
        duration-300
        hover:shadow-xl
        ${borderColor}
      `}
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          mb-6
        "
      >
        <h2
          className="
            text-[20px]
            sm:text-[22px]
            font-semibold
            text-[#1f1f1f]
          "
        >
          {title}
        </h2>

        <div
          className="
            bg-[#e5e7eb]
            text-[#6b7280]
            min-w-[36px]
            h-[32px]
            px-3
            flex
            items-center
            justify-center
            rounded-full
            text-[14px]
            transition-all
            duration-300
            hover:scale-105
          "
        >
          {tasks.length}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}