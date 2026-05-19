import { useState } from "react";
//service api
import api from "../../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}
// Composant de modal pour créer un projet
export default function CreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contributors, setContributors] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Soumission du formulaire pour créer un projet
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Transformation de la chaîne de contributeurs en tableau d'emails
      const contributorList = contributors
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      await api.post("/projects", {
        name: title,
        description,
        contributors: contributorList,
      });

      // Réinitialisation des champs
      setTitle("");
      setDescription("");
      setContributors("");

      onClose();

      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        "Erreur lors de la création du projet"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-[520px] rounded-[10px] bg-white p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-black text-2xl">
          ×
        </button>

        <h2 className="text-[26px] text-[#1f1f1f] mb-10">Créer un projet</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-[#1f1f1f]">Titre*</label>
            <input type="text" value={title}
              onChange={(e) => setTitle(e.target.value)} placeholder=""
              className="w-full h-[54px] border border-gray-200 rounded-[4px] px-4 outline-none focus:border-black" />
          </div>

          <div>
            <label className="block text-sm mb-2 text-[#1f1f1f]">Description*</label>
            <textarea value={description}
              onChange={(e) => setDescription(e.target.value)} rows={4}
              className="w-full h-[54px] border border-gray-200 rounded-[4px] px-4 outline-none focus:border-black" />
          </div>

          <div>
            <label className="block text-sm mb-2 text-[#1f1f1f]">Contributeurs</label>
            <input type="text" value={contributors}
              onChange={(e) => setContributors(e.target.value)} placeholder="Choisir un ou plusieurs collaborateurs"
              className="w-full h-[54px] border border-gray-200 rounded-[4px] px-4 outline-none focus:border-black" />
            <p className="text-xs text-gray-400 mt-2">Sépare les emails avec une virgule</p>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            onClick={handleSubmit} disabled={loading || !title || !description}
            className="mt-4 h-[54px] px-7 rounded-[14px] bg-[#1f1f23] text-white text-[17px] transition-all duration-300 hover:bg-black disabled:opacity-50">
            {loading ? "Création..." : "Ajouter un projet"}
          </button>
        </div>
      </div>
    </div>
  );
}