import DashboardPage from "@/components/pages/DashboardPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord | Abricot",
  description: "Gestion des projets et des tâches",
};

export default function Dashboard() {
  return <DashboardPage />;
}