import { useState } from "react";
import { Search } from "lucide-react";
import { tasks } from "../../data/mockdata";
import TaskCard from "./TaskCard";
import type { Task } from "./types";

export default function TaskListView() {
  const [search, setSearch] = useState("");

  const filteredTasks = (
    tasks as Task[]
  ).filter((task) =>
    task.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      className="
        bg-white
        border
        border-[#e7e7e7]
        rounded-[18px]
        p-5
        sm:p-7
        lg:p-10
      "
    >
      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-start
          xl:justify-between
          gap-6
          mb-8
        "
      >
        <div>
          <h2
            className="
              text-[24px]
              sm:text-[26px]
              lg:text-[30px]
              font-bold
              text-[#1f1f1f]
            "
          >
            Mes tâches assignées
          </h2>

          <p
            className="
              text-[15px]
              sm:text-[17px]
              lg:text-[18px]
              text-[#8a8f98]
              mt-1
            "
          >
            Par ordre de priorité
          </p>
        </div>

        <div
          className="
            w-full
            xl:w-[340px]
            h-[56px]
            border
            border-[#e5e5e5]
            rounded-[12px]
            px-5
            flex
            items-center
            justify-between
            transition-all
            duration-300
            focus-within:border-[#d45d00]
            focus-within:shadow-lg
            bg-white
          "
        >
          <input
            type="text"
            placeholder="Rechercher une tâche"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              outline-none
              text-[15px]
              sm:text-[16px]
              text-[#667085]
              bg-transparent
            "
          />

          <Search
            size={18}
            className="text-[#667085]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}