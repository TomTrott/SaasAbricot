import type { Metadata } from "next";
import ProjectsPage from "@/components/pages/ProjectsPage";

export const metadata: Metadata = {
  title: "Mes projets | Abricot",
  description: "Gérez vos projets et vos collaborateurs sur Abricot.",
};

export default function Projects() {
  return <ProjectsPage />;
}