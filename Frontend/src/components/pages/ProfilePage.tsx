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
  // États utilisateur
  const [user, setUser] = useState<User | null>(null);
  // États formulaire
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // États mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  // États UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // États messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Chargement du profil utilisateur
  useEffect(() => {
    const fetchProfile = async () => {

      try {
        const response = await api.get("/auth/profile");
        const profileUser = response.data.data.user;

        setUser(profileUser);

        // Découpe prénom / nom
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

  // Soumission formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Active le mode édition
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      // Nom complet
      const fullName = `${firstName} ${lastName}`.trim();

      // Mise à jour profil
      await api.put("/auth/profile", {
        name: fullName,
        email,
      });

      // Mise à jour mot de passe
      if (currentPassword || newPassword) {

        if (!currentPassword || !newPassword) {
          setError(
            "Veuillez remplir l'ancien et le nouveau mot de passe"
          );
          setSaving(false);
          return;
        }

        await api.put("/auth/password", {
          currentPassword,
          newPassword,
        });
        setCurrentPassword("");
        setNewPassword("");
      }

      setMessage("Informations mises à jour avec succès");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        "Erreur lors de la mise à jour"
      );
    } finally {
      setSaving(false);

    }
  };

  // Chargement
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <p className="text-[18px] text-[#1f1f1f]">
          Chargement...
        </p>
      </div>
    );
  }

  return (

    <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
      <Navbar />
      {/* Contenu principal */}
      <main
        className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8"
        aria-labelledby="profile-title"
      >

        {/* Carte profil */}
        <div className="mx-auto max-w-[1100px] rounded-[18px] border border-[#e7e7e7] bg-white p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="mb-8">
            <h1
              id="profile-title"
              className="text-[28px] font-semibold text-[#1f1f1f]"
            >
              Mon compte
            </h1>
            <p className="mt-1 text-[17px] text-[#4b5563]">
              {user?.name}
            </p>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >

            {/* Nom */}
            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-[15px] font-medium text-[#1f1f1f]"
              >
                Nom
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                disabled={!isEditing}
                onChange={(e) => setLastName(e.target.value)}
                className={`h-[58px] w-full rounded-[10px] border px-4 text-[15px] outline-none transition-all ${isEditing
                    ? "border-[#d6d6d6] bg-white text-[#1f1f1f] focus:border-[#d45d00] focus:ring-2 focus:ring-[#d45d00]/20"
                    : "cursor-not-allowed border-[#ececec] bg-[#f7f7f7] text-[#5f6673]"
                  }`}
              />
            </div>

            {/* Prénom */}
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-[15px] font-medium text-[#1f1f1f]"
              >
                Prénom
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={firstName}
                disabled={!isEditing}
                onChange={(e) => setFirstName(e.target.value)}
                className={`h-[58px] w-full rounded-[10px] border px-4 text-[15px] outline-none transition-all ${isEditing
                    ? "border-[#d6d6d6] bg-white text-[#1f1f1f] focus:border-[#d45d00] focus:ring-2 focus:ring-[#d45d00]/20"
                    : "cursor-not-allowed border-[#ececec] bg-[#f7f7f7] text-[#5f6673]"
                  }`}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[15px] font-medium text-[#1f1f1f]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                disabled={!isEditing}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-[58px] w-full rounded-[10px] border px-4 text-[15px] outline-none transition-all ${isEditing
                    ? "border-[#d6d6d6] bg-white text-[#1f1f1f] focus:border-[#d45d00] focus:ring-2 focus:ring-[#d45d00]/20"
                    : "cursor-not-allowed border-[#ececec] bg-[#f7f7f7] text-[#5f6673]"
                  }`}
              />
            </div>

            {/* Mot de passe actuel */}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-[15px] font-medium text-[#1f1f1f]"
              >
                Mot de passe actuel
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                disabled={!isEditing}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className={`h-[58px] w-full rounded-[10px] border px-4 text-[15px] outline-none transition-all ${isEditing
                    ? "border-[#d6d6d6] bg-white text-[#1f1f1f] focus:border-[#d45d00] focus:ring-2 focus:ring-[#d45d00]/20"
                    : "cursor-not-allowed border-[#ececec] bg-[#f7f7f7] text-[#5f6673]"
                  }`}
              />
            </div>

            {/* Nouveau mot de passe */}
            {isEditing && (
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-[15px] font-medium text-[#1f1f1f]"
                >
                  Nouveau mot de passe
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-[58px] w-full rounded-[10px] border border-[#d6d6d6] bg-white px-4 text-[15px] text-[#1f1f1f] outline-none transition-all focus:border-[#d45d00] focus:ring-2 focus:ring-[#d45d00]/20"
                />
              </div>

            )}
            {/* Message succès */}
            {message && (
              <div
                role="status"
                aria-live="polite"
                className="text-sm font-medium text-green-700"
              >
                {message}
              </div>

            )}
            {/* Message erreur */}
            {error && (

              <div
                role="alert"
                aria-live="assertive"
                className="text-sm font-medium text-red-700"
              >
                {error}
              </div>

            )}
            {/* Bouton */}
            <button
              type="submit"
              disabled={saving}
              aria-busy={saving}
              className="mt-2 h-[54px] w-fit rounded-[12px] bg-[#1f1f1f] px-7 text-[16px] font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2 disabled:opacity-50"
            >
              {saving
                ? "Enregistrement..."
                : isEditing
                  ? "Enregistrer"
                  : "Modifier les informations"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}