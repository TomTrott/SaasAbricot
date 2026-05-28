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
      <div className="w-full max-w-[520px] rounded-[10px] bg-white p-8 relative shadow-2xl">
        {/* bouton fermer */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-black text-2xl"
        >
          ×
        </button>

        {/* titre */}
        <h2 className="text-[26px] text-[#1f1f1f] mb-10">
          Créer un projet
        </h2>

        <div className="space-y-6">
          {/* titre projet */}
          <div>
            <label className="block text-sm mb-2 text-[#1f1f1f]">
              Titre*
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full h-[54px] border border-gray-200 rounded-[4px] px-4 outline-none focus:border-black"
            />
          </div>

          {/* description */}
          <div>
            <label className="block text-sm mb-2 text-[#1f1f1f]">
              Description*
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={4}
              className="w-full border border-gray-200 rounded-[4px] px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* contributeurs */}
          <div
            ref={dropdownRef}
            className="relative"
          >
            <label className="block text-sm mb-2 text-[#1f1f1f]">
              Contributeurs
            </label>

            {/* bouton dropdown */}
            <button
              type="button"
              onClick={() =>
                setDropdownOpen(
                  !dropdownOpen
                )
              }
              className="w-full min-h-[54px] border border-gray-200 rounded-[4px] px-4 py-3 flex items-center justify-between"
            >
              <span className="truncate text-sm text-left">
                {selectedUsers.length > 0
                  ? selectedUsers
                    .map((u) => u.name)
                    .join(", ")
                  : "Choisir un ou plusieurs collaborateurs"}
              </span>

              {/* flèche */}
              <svg
                className={`w-5 h-5 transition-transform flex-shrink-0 ${dropdownOpen
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
              <div className="absolute z-50 mt-2 w-full rounded-[8px] border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                {users.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400">
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
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleUser(
                              user
                            )
                          }
                          className="w-4 h-4"
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
                  })
                )}
              </div>
            )}
          </div>

          {/* erreur */}
          {error && (
            <div className="text-red-500 text-sm">
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
            className="mt-4 h-[54px] px-7 rounded-[14px] bg-[#1f1f23] text-white text-[17px] transition-all duration-300 hover:bg-black disabled:opacity-50"
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