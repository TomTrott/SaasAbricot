"use client";

import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  project: any;
};

export default function ProjectCard({ project }: Props) {
  const router = useRouter();

  const totalTasks = project?._count?.tasks || 0;

  // temporaire
  const tasksCompleted = 0;

  const progress =
    totalTasks > 0
      ? (tasksCompleted / totalTasks) * 100
      : 0;

  const owner = project.owner;

  return (
    <div
      onClick={() =>
        router.push(`/projects/${project.id}`)
      }
      className="bg-white border border-[#e7e7e7] rounded-[18px] p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* TITLE */}
      <div className="mb-10">
        <h2 className="text-[22px] font-semibold text-[#1f1f1f] mb-3">
          {project.name}
        </h2>

        <p className="text-[15px] leading-relaxed text-[#8b8f98]">
          {project.description ||
            "Aucune description"}
        </p>
      </div>

      {/* PROGRESSION */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] text-[#8b8f98]">
            Progression
          </span>

          <span className="text-[14px] text-[#1f1f1f] font-medium">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full h-[8px] bg-[#ececf1] rounded-full overflow-hidden mb-3">
          <div
            style={{
              width: `${progress}%`,
            }}
            className="h-full bg-[#d45d00] rounded-full transition-all duration-500"
          ></div>
        </div>

        <p className="text-[13px] text-[#8b8f98]">
          {tasksCompleted}/{totalTasks} tâches
          terminées
        </p>
      </div>

      {/* TEAM */}
      <div>
        <div className="flex items-center gap-2 text-[#8b8f98] text-[14px] mb-4">
          <Users size={15} />

          <span>
            Équipe ({1 + project.members.length})
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* owner */}
          {owner && (
            <>
              <div className="w-[34px] h-[34px] rounded-full bg-[#f5dfd2] flex items-center justify-center text-[12px] text-[#1f1f1f] uppercase">
                {owner?.name?.[0] ||
                  owner?.email?.[0]}
              </div>

              <div className="h-[34px] px-4 rounded-full bg-[#fbe4d7] flex items-center justify-center text-[14px] text-[#d45d00] font-medium">
                Propriétaire
              </div>
            </>
          )}

          {/* members */}
          {project.members.map((member: any) => (
            <div
              key={member.id}
              className="w-[34px] h-[34px] rounded-full bg-[#ececf1] flex items-center justify-center text-[12px] text-[#1f1f1f] uppercase"
            >
              {member.user?.name?.[0] ||
                member.user?.email?.[0]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}