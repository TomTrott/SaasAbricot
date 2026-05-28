import type { Metadata } from "next";
import ProfilePage from "@/components/pages/ProfilePage";

export const metadata: Metadata = {
  title: "Mon profil | Abricot",
  description: "Consultez et gérez votre profil utilisateur sur Abricot.",
};

export default function Profile() {
  return <ProfilePage />;
}