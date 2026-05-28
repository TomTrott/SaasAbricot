import { useEffect, useRef, useState } from "react";
// service api
import api from "../../services/api";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}
interface User {
  id: string;
  name: string;
  email: string;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: Props) {
  // États formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // utilisateurs
  const [users, setUsers] = useState<User[]>([]);
  // utilisateurs sélectionnés
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  // dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // chargement
  const [loading, setLoading] = useState(false);
  // erreur
  const [error, setError] = useState("");
  // ref dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // récupérer les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");

        // sendSuccess => data.users
        setUsers(res.data.data.users);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  // fermer dropdown quand on clique dehors
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
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
  const toggleUser = (user: User) => {
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

  // création projet
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // tableau des emails utilisateurs
      const contributorList =
        selectedUsers.map(
          (user) => user.email
        );

      // appel API
      await api.post("/projects", {
        name: title,
        description,
        contributors: contributorList,
      });

      // reset
      setTitle("");
      setDescription("");
      setSelectedUsers([]);

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
      <div className="relative w-full max-w-[520px] rounded-[14px] bg-white p-8 shadow-2xl">
        
        {/* bouton fermer */}
        <button
          type="button"
          aria-label="Fermer la fenêtre"
          onClick={onClose}
          className="absolute right-6 top-6 text-[28px] text-[#6b7280] transition hover:text-black"
        >
          ×
        </button>

        {/* titre */}
        <h2 className="mb-10 text-[26px] font-semibold text-[#1f1f1f]">
          Créer un projet
        </h2>

        <div className="space-y-6">
          
          {/* titre projet */}
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
              className="h-[54px] w-full rounded-[8px] border border-[#d1d5db] px-4 text-[15px] text-[#1f1f1f] outline-none transition-all placeholder:text-[#6b7280] focus:border-[#1f1f1f]"
              placeholder="Nom du projet"
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
                setDescription(
                  e.target.value
                )
              }
              rows={4}
              placeholder="Décrivez le projet"
              className="w-full rounded-[8px] border border-[#d1d5db] px-4 py-3 text-[15px] text-[#1f1f1f] outline-none transition-all placeholder:text-[#6b7280] focus:border-[#1f1f1f]"
            />
          </div>

          {/* contributeurs */}
          <div
            ref={dropdownRef}
            className="relative"
          >
            <label
              htmlFor="contributors-dropdown"
              className="mb-2 block text-[15px] font-medium text-[#1f1f1f]"
            >
              Contributeurs
            </label>

            {/* bouton dropdown */}
            <button
              id="contributors-dropdown"
              type="button"
              aria-label="Choisir des contributeurs"
              aria-expanded={dropdownOpen}
              onClick={() =>
                setDropdownOpen(
                  !dropdownOpen
                )
              }
              className="flex min-h-[54px] w-full items-center justify-between rounded-[8px] border border-[#d1d5db] px-4 py-3 text-left transition-all hover:border-[#9ca3af]"
            >
              <span className="truncate text-[14px] text-[#374151]">
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
              <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-[10px] border border-[#d1d5db] bg-white shadow-lg">
                
                {users.length === 0 ? (
                  <div className="px-4 py-3 text-[14px] text-[#6b7280]">
                    Aucun utilisateur
                  </div>
                ) : (
                  users.map((user) => {
                    const checked =
                      selectedUsers.some(
                        (u) =>
                          u.id === user.id
                      );

                    return (
                      <label
                        key={user.id}
                        htmlFor={`user-${user.id}`}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-[#f9fafb]"
                      >
                        <input
                          id={`user-${user.id}`}
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleUser(user)
                          }
                          className="h-4 w-4 accent-[#1f1f1f]"
                        />

                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-[#1f1f1f]">
                            {user.name}
                          </span>

                          <span className="text-[13px] text-[#5f6673]">
                            {user.email}
                          </span>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* erreur */}
          {error && (
            <div className="text-[14px] font-medium text-red-600">
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
            className="mt-4 h-[54px] rounded-[14px] bg-[#1f1f23] px-7 text-[17px] font-medium text-white transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Création..."
              : "Ajouter un projet"}
          </button>
        </div>
      </div>
    </div>
  );
}