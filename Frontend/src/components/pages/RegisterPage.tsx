"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/services/api";
import bannerRegister from "@/assets/images/banniereregister.png";
import logoAbricot from "@/assets/logoabricot.png";

// Page d'inscription
export default function RegisterPage() {
  // Initialisation des états pour les champs du formulaire, les erreurs et le chargement
  const router = useRouter();
  // formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // erreurs
  const [error, setError] = useState("");
  // chargement
  const [loading, setLoading] = useState(false);
  // Titre de page SEO + accessibilité
  useEffect(() => {
    document.title = "Inscription | Abricot";
  }, []);

  // Gère l'inscription de l'utilisateur
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Envoie une requête POST à l'API pour enregistrer l'utilisateur
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (error: any) {
      console.log("Erreur complète :", error);
      console.log(
        "Data JSON :",
        JSON.stringify(
          error.response?.data,
          null,
          2
        )
      );
      console.log(
        "Details :",
        JSON.stringify(
          error.response?.data?.details,
          null,
          2
        )
      );
      console.log(
        "Status :",
        error.response?.status
      );
      console.log(
        "Headers :",
        error.response?.headers
      );
      setError(
        error?.response?.data?.message ||
          "Erreur lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      role="main"
      aria-label="Page d'inscription"
      className="flex min-h-screen overflow-hidden bg-[#f3f3f3]"
    >
      {/* Partie gauche - Formulaire */}
      <section
        aria-labelledby="register-title"
        className="relative flex w-full items-center justify-center bg-[#f3f3f3] px-8 lg:w-[39%]"
      >
        {/* Logo */}
        <div className="absolute left-1/2 top-20 -translate-x-1/2">
          <Image
            src={logoAbricot}
            alt="Logo Abricot"
            className="h-auto w-[320px]"
            priority
          />
        </div>

        <div className="w-full max-w-[360px]">
          <h1
            id="register-title"
            className="mb-14 text-center text-[58px] font-bold leading-none text-[#d45d00]"
          >
            Inscription
          </h1>

          <form
            onSubmit={handleRegister}
            className="space-y-6"
          >
            {/* Nom */}
            <div>
              <label
                htmlFor="name"
                className="mb-3 block text-[18px] text-[#1d1d1d]"
              >
                Nom
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="h-[54px] w-full rounded-[4px] border border-[#d8d8d8] bg-white px-4 text-[16px] text-[#1d1d1d] transition-all duration-200 focus:border-[#d45d00] focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-3 block text-[18px] text-[#1d1d1d]"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="h-[54px] w-full rounded-[4px] border border-[#d8d8d8] bg-white px-4 text-[16px] text-[#1d1d1d] transition-all duration-200 focus:border-[#d45d00] focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="mb-3 block text-[18px] text-[#1d1d1d]"
              >
                Mot de passe
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="h-[54px] w-full rounded-[4px] border border-[#d8d8d8] bg-white px-4 text-[16px] text-[#1d1d1d] transition-all duration-200 focus:border-[#d45d00] focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2"
              />
            </div>

            {/* Erreur */}
            {error && (
              <p
                role="alert"
                aria-live="assertive"
                className="text-[15px] text-red-600"
              >
                {error}
              </p>
            )}

            {/* Bouton inscription */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="h-[58px] w-full rounded-[12px] bg-[#1f1f23] text-[24px] text-white transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2"
            >
              {loading
                ? "Inscription..."
                : "S'inscrire"}
            </button>
          </form>

          {/* Navigation */}
          <nav
            aria-label="Navigation authentification"
            className="mt-20"
          >
            <div className="flex items-center justify-center gap-2 whitespace-nowrap text-[20px]">
              <span className="text-[#1d1d1d]">
                Déjà inscrit ?
              </span>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                className="rounded-[4px] font-semibold text-[#7a2f00] underline transition-all hover:text-[#5f2400] focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2"
              >
                Se connecter
              </button>
            </div>
          </nav>
        </div>
      </section>

      {/* Partie droite - Illustration */}
      <aside
        aria-label="Illustration"
        className="hidden h-screen lg:block lg:w-[61%]"
      >
        <Image
          src={bannerRegister}
          alt="Illustration de la page d'inscription"
          className="h-full w-full object-cover"
          priority
        />
      </aside>
    </main>
  );
}