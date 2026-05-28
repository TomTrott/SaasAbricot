import type { Metadata } from "next";
import ProjectDetailsPage from "@/components/pages/ProjectDetailsPage";

type Props = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "Détails du projet | Abricot",
  description: "Consultez les détails d’un projet et gérez les tâches.",
};

export default function ProjectDetails() {
  return <ProjectDetailsPage />;
}