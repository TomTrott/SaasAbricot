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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-project-title"
    >
      <div className="relative w-full max-w-[520px] rounded-[16px] bg-white p-8 shadow-2xl">
        {/* bouton fermer */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fenêtre"
          className="absolute right-6 top-6 flex h-[40px] w-[40px] items-center justify-center rounded-full text-[24px] text-[#4b5563] transition-all hover:bg-[#f3f4f6] hover:text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30"
        >
          ×
        </button>

        {/* titre */}
        <h2
          id="edit-project-title"
          className="mb-10 text-[26px] font-semibold text-[#1f1f1f]"
        >
          Modifier le projet
        </h2>

        <div className="space-y-6">
          {/* titre */}
          <div>
            <label
              htmlFor="project-title"
              className="mb-2 block text-[15px] font-medium text-[#1f1f1f]"
            >
              Titre*
            </label>

            <input
              id="project-title"
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="h-[54px] w-full rounded-[10px] border border-[#d1d5db] bg-white px-4 text-[15px] text-[#1f1f1f] outline-none transition-all placeholder:text-[#6b7280] focus:border-[#d45d00] focus:ring-4 focus:ring-[#d45d00]/20"
            />
          </div>

          {/* description */}
          <div>
            <label
              htmlFor="project-description"
              className="mb-2 block text-[15px] font-medium text-[#1f1f1f]"
            >
              Description*
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              className="w-full rounded-[10px] border border-[#d1d5db] bg-white px-4 py-3 text-[15px] text-[#1f1f1f] outline-none transition-all placeholder:text-[#6b7280] focus:border-[#d45d00] focus:ring-4 focus:ring-[#d45d00]/20"
            />
          </div>

          {/* contributeurs */}
          <div
            ref={dropdownRef}
            className="relative"
          >
            <label
              htmlFor="contributors-button"
              className="mb-2 block text-[15px] font-medium text-[#1f1f1f]"
            >
              Contributeurs
            </label>

            {/* bouton dropdown */}
            <button
              id="contributors-button"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
              className="flex min-h-[54px] w-full items-center justify-between rounded-[10px] border border-[#d1d5db] bg-white px-4 text-left text-[#1f1f1f] transition-all hover:border-[#9ca3af] focus:outline-none focus:ring-4 focus:ring-[#d45d00]/20"
            >
              <span className="truncate text-[15px] text-[#1f1f1f]">
                {selectedUsers.length > 0
                  ? selectedUsers
                      .map((u) => u.name)
                      .join(", ")
                  : "Choisir un ou plusieurs collaborateurs"}
              </span>

              {/* flèche */}
              <svg
                className={`h-5 w-5 flex-shrink-0 text-[#4b5563] transition-transform ${
                  dropdownOpen
                    ? "rotate-180"
                    : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              <div
                role="listbox"
                className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-[10px] border border-[#d1d5db] bg-white shadow-lg"
              >
                {Array.isArray(users) &&
                  users.map((user) => {
                    const checked =
                      selectedUsers.some(
                        (u) => u.id === user.id
                      );

                    return (
                      <label
                        key={user.id}
                        htmlFor={`user-${user.id}`}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-all hover:bg-[#f9fafb]"
                      >
                        <input
                          id={`user-${user.id}`}
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleUser(user)
                          }
                          className="h-4 w-4 rounded border-[#9ca3af] text-[#d45d00] focus:ring-[#d45d00]"
                        />

                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-[#1f1f1f]">
                            {user.name}
                          </span>

                          <span className="text-[13px] text-[#4b5563]">
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
            <div
              role="alert"
              className="text-[14px] font-medium text-red-600"
            >
              {error}
            </div>
          )}

          {/* bouton */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              !title ||
              !description
            }
            className="mt-4 h-[54px] rounded-[14px] bg-[#1f1f23] px-7 text-[16px] font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-black/20 disabled:cursor-not-allowed disabled:opacity-50"
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