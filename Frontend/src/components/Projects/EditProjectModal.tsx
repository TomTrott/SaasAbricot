"use client";

import { useEffect, useState } from "react";
//service API
import api from "../../services/api";
// Types pour les props du composant
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated?: () => void;
  project: {
    id: string;
    name: string;
    description: string;
    members?: any[];
  };
}
// Composant de modal pour modifier un projet
export default function EditProjectModal({
  isOpen,
  onClose,
  onProjectUpdated,
  project,
}: Props) {
  // États locaux pour les champs du formulaire, le chargement et les erreurs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contributors, setContributors] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialise les champs avec les données du projet
  useEffect(() => {
    if (project) {
      setTitle(project.name || "");
      setDescription(project.description || "");
      const emails = project.members?.map((member: any) => member.user?.email).join(", ") || "";
      setContributors(emails);
    }
  }, [project]);

  if (!isOpen) return null;

  // Soumission du formulaire pour modifier un projet
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Met à jour les informations de base du projet
      await api.put(`/projects/${project.id}`, {
        name: title,
        description,
      });

      // Récupère les emails actuels des contributeurs
      const currentEmails = project.members?.map((member: any) => ({
        email: member.user.email,
        userId: member.user.id,
      })) || [];

      // Transformations des emails saisis en tableau
      const newEmails = contributors
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email.length > 0);

      // Ajoute les nouveaux contributeurs
      for (const email of newEmails) {
        const alreadyExists = currentEmails.find(
          (member) => member.email.toLowerCase() === email
        );
        if (!alreadyExists) {
          await api.post(`/projects/${project.id}/contributors`, { email });
        }
      }

      // Supprime les anciens contributeurs non présents dans la nouvelle liste
      for (const member of currentEmails) {
        const stillExists = newEmails.includes(member.email.toLowerCase());
        if (!stillExists) {
          await api.delete(`/projects/${project.id}/contributors/${member.userId}`);
        }
      }

      onClose();
      if (onProjectUpdated) onProjectUpdated();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Erreur lors de la modification du projet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="relative w-full max-w-[520px] rounded-[16px] bg-white p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-2xl text-gray-400 transition-all hover:text-black">×</button>

        <h2 className="mb-10 text-[26px] text-[#1f1f1f]">Modifier le projet</h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-[#1f1f1f]">Titre*</label>
            <input type="text" value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-[54px] w-full rounded-[10px] border border-gray-200 px-4 outline-none transition-all focus:border-black" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#1f1f1f]">Description*</label>
            <textarea value={description}
              onChange={(e) => setDescription(e.target.value)} rows={4}
              className="w-full rounded-[10px] border border-gray-200 px-4 py-3 outline-none transition-all focus:border-black" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#1f1f1f]">Contributeurs</label>
            <input type="text" value={contributors}
              onChange={(e) => setContributors(e.target.value)} placeholder="email1@gmail.com, email2@gmail.com"
              className="h-[54px] w-full rounded-[10px] border border-gray-200 px-4 outline-none transition-all focus:border-black" />
            <p className="mt-2 text-xs text-gray-400">Sépare les emails avec une virgule</p>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <button onClick={handleSubmit} disabled={loading || !title || !description}
            className="mt-4 h-[54px] rounded-[14px] bg-[#1f1f23] px-7 text-[17px] text-white transition-all duration-300 hover:bg-black disabled:opacity-50">
            {loading ? "Modification..." : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}