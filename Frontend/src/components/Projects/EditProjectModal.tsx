"use client";

import { useEffect, useRef, useState } from "react";
// service API
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
  // États formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // utilisateurs
  const [users, setUsers] = useState<any[]>([]);
  // utilisateurs sélectionnés
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  // dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // chargement
  const [loading, setLoading] = useState(false);
  // erreur
  const [error, setError] = useState("");
  // ref dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // initialise les données du projet
  useEffect(() => {
    if (project) {
      setTitle(project.name || "");
      setDescription(project.description || "");

      const currentUsers =
        project.members?.map((member: any) => ({
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
        })) || [];

      setSelectedUsers(currentUsers);
    }
  }, [project]);

  // récupérer les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");

        setUsers(res.data.data.users || []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // fermer dropdown si clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // sélectionner / désélectionner utilisateur
  const toggleUser = (user: any) => {
    const exists = selectedUsers.find(
      (u) => u.id === user.id
    );

    if (exists) {
      setSelectedUsers(
        selectedUsers.filter(
          (u) => u.id !== user.id
        )
      );
    } else {
      setSelectedUsers([
        ...selectedUsers,
        user,
      ]);
    }
  };

  if (!isOpen) return null;

  // Soumission du formulaire
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // mise à jour du projet
      await api.put(`/projects/${project.id}`, {
        name: title,
        description,
      });

      // utilisateurs actuellement dans le projet
      const currentMembers =
        project.members?.map((member: any) => ({
          email: member.user.email,
          userId: member.user.id,
        })) || [];

      // emails sélectionnés
      const selectedEmails = selectedUsers.map(
        (user) => user.email
      );

      // ajouter nouveaux contributeurs
      for (const email of selectedEmails) {
        const alreadyExists =
          currentMembers.find(
            (member) =>
              member.email.toLowerCase() ===
              email.toLowerCase()
          );

        if (!alreadyExists) {
          await api.post(
            `/projects/${project.id}/contributors`,
            { email }
          );
        }
      }

      // supprimer anciens contributeurs
      for (const member of currentMembers) {
        const stillExists =
          selectedEmails.includes(member.email);

        if (!stillExists) {
          await api.delete(
            `/projects/${project.id}/contributors/${member.userId}`
          );
        }
      }
      onClose();
      if (onProjectUpdated) {
        onProjectUpdated();
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        "Erreur lors de la modification du projet"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="relative w-full max-w-[520px] rounded-[16px] bg-white p-8 shadow-2xl">
        {/* bouton fermer */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-400 transition-all hover:text-black"
        >
          ×
        </button>

        {/* titre */}
        <h2 className="mb-10 text-[26px] text-[#1f1f1f]">
          Modifier le projet
        </h2>

        <div className="space-y-6">
          {/* titre */}
          <div>
            <label className="mb-2 block text-sm text-[#1f1f1f]">
              Titre*
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="h-[54px] w-full rounded-[10px] border border-gray-200 px-4 outline-none transition-all focus:border-black"
            />
          </div>

          {/* description */}
          <div>
            <label className="mb-2 block text-sm text-[#1f1f1f]">
              Description*
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              className="w-full rounded-[10px] border border-gray-200 px-4 py-3 outline-none transition-all focus:border-black"
            />
          </div>

          {/* contributeurs */}
          <div
            ref={dropdownRef}
            className="relative"
          >
            <label className="mb-2 block text-sm text-[#1f1f1f]">
              Contributeurs
            </label>

            {/* bouton dropdown */}
            <button
              type="button"
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
              className="flex h-[54px] w-full items-center justify-between rounded-[10px] border border-gray-200 px-4"
            >
              <span className="truncate text-left text-sm">
                {selectedUsers.length > 0
                  ? selectedUsers
                    .map((u) => u.name)
                    .join(", ")
                  : "Choisir un ou plusieurs collaborateurs"}
              </span>

              {/* flèche */}
              <svg
                className={`h-5 w-5 transition-transform ${dropdownOpen
                  ? "rotate-180"
                  : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* menu dropdown */}
            {dropdownOpen && (
              <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-[8px] border border-gray-200 bg-white shadow-lg">
                {Array.isArray(users) &&
                  users.map((user) => {
                    const checked =
                      selectedUsers.some(
                        (u) => u.id === user.id
                      );

                    return (
                      <label
                        key={user.id}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleUser(user)
                          }
                        />

                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user.name}
                          </span>

                          <span className="text-xs text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      </label>
                    );
                  })}
              </div>
            )}
          </div>

          {/* erreur */}
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          {/* bouton */}
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !title ||
              !description
            }
            className="mt-4 h-[54px] rounded-[14px] bg-[#1f1f23] px-7 text-[17px] text-white transition-all duration-300 hover:bg-black disabled:opacity-50"
          >
            {loading
              ? "Modification..."
              : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}