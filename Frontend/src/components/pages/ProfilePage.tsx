"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import api from "@/services/api";
// Type pour l'utilisateur
type User = {
  id: string;
  email: string;
  name: string | null;
};
// Page de profil utilisateur
export default function ProfilePage() {
  // définit les états pour les données utilisateur
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  // États pour la gestion du chargement
  const [loading, setLoading] = useState(true);
  // États pour la gestion de l'édition et des messages
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  // État pour les erreurs
  const [error, setError] = useState("");

  // Charge le profil utilisateur au montage
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Récupère les données du profil
        const response = await api.get("/auth/profile");
        const profileUser = response.data.data.user;
        setUser(profileUser);
        // Sépare le nom complet en prénom et nom de famille
        const fullName = profileUser.name || "";
        const nameParts = fullName.split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
        setEmail(profileUser.email);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Gère la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Premier clic active le mode édition
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");
      // Concatène le prénom et le nom pour former le nom complet
      const fullName = `${firstName} ${lastName}`.trim();

      // Met à jour le profil
      await api.put("/auth/profile", { name: fullName, email });

      // Met à jour le mot de passe si les champs sont remplis
      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) {
          setError("Veuillez remplir l'ancien et le nouveau mot de passe");
          setSaving(false);
          return;
        }
        await api.put("/auth/password", { currentPassword, newPassword });
        setCurrentPassword("");
        setNewPassword("");
      }

      setMessage("Informations mises à jour avec succès");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]"><p className="text-[#1f1f1f] text-[18px]">Chargement...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Navbar />
      {/* Contenu principal de la page de profil */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
        {/* Conteneur du formulaire de profil */}
        <div className="max-w-[1100px] mx-auto bg-white border border-[#e7e7e7] rounded-[18px] p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-[28px] font-semibold text-[#1f1f1f]">Mon compte</h1>
            <p className="text-[#8b8f98] text-[17px] mt-1">{user?.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-[15px] text-[#1f1f1f] mb-2">Nom</label>
              <input type="text" value={lastName} disabled={!isEditing}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full h-[58px] border rounded-[10px] px-4 outline-none text-[15px] transition-all ${isEditing ? "border-[#e5e5e5] bg-white text-[#1f1f1f] focus:border-[#d45d00]" : "border-[#ececec] bg-[#f7f7f7] text-[#8b8f98] cursor-not-allowed"}`} />
            </div>

            <div>
              <label className="block text-[15px] text-[#1f1f1f] mb-2">Prénom</label>
              <input type="text" value={firstName} disabled={!isEditing}
                onChange={(e) => setFirstName(e.target.value)} className={`w-full h-[58px] border rounded-[10px] px-4 outline-none text-[15px] transition-all ${isEditing ? "border-[#e5e5e5] bg-white text-[#1f1f1f] focus:border-[#d45d00]" : "border-[#ececec] bg-[#f7f7f7] text-[#8b8f98] cursor-not-allowed"}`} />
            </div>

            <div>
              <label className="block text-[15px] text-[#1f1f1f] mb-2">Email</label>
              <input type="email" value={email} disabled={!isEditing}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-[58px] border rounded-[10px] px-4 outline-none text-[15px] transition-all ${isEditing ? "border-[#e5e5e5] bg-white text-[#1f1f1f] focus:border-[#d45d00]" : "border-[#ececec] bg-[#f7f7f7] text-[#8b8f98] cursor-not-allowed"}`} />
            </div>

            <div>
              <label className="block text-[15px] text-[#1f1f1f] mb-2">Mot de passe actuel</label>
              <input type="password" value={currentPassword} disabled={!isEditing}
                onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className={`w-full h-[58px] border rounded-[10px] px-4 outline-none text-[15px] transition-all ${isEditing ? "border-[#e5e5e5] bg-white text-[#1f1f1f] focus:border-[#d45d00]" : "border-[#ececec] bg-[#f7f7f7] text-[#8b8f98] cursor-not-allowed"}`} />
            </div>

            {isEditing && (
              <div>
                <label className="block text-[15px] text-[#1f1f1f] mb-2">Nouveau mot de passe</label>
                <input type="password" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••"
                  className="w-full h-[58px] border border-[#e5e5e5] rounded-[10px] px-4 outline-none text-[15px] bg-white text-[#1f1f1f] focus:border-[#d45d00]" />
              </div>
            )}

            {message && <div className="text-green-600 text-sm">{message}</div>}
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button type="submit" disabled={saving} className="mt-2 w-fit h-[54px] px-7 rounded-[12px] bg-[#1f1f1f] text-white text-[16px] font-medium transition-all duration-300 hover:bg-black hover:scale-[1.02] hover:shadow-lg disabled:opacity-50">
              {saving ? "Enregistrement..." : isEditing ? "Enregistrer" : "Modifier les informations"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}