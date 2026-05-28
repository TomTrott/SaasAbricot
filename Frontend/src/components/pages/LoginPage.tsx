"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/services/api";
import bannerLogin from "@/assets/images/bannierelogin.png";
import logoAbricot from "@/assets/logoabricot.png";

// Composant de la page de connexion
export default function LoginPage() {
  // Router de Next.js pour la navigation
  const router = useRouter();
  // États locaux pour les champs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // États pour la gestion des erreurs et du chargement
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Ajoute un titre de page SEO + accessibilité
  useEffect(() => {
    document.title = "Connexion | Abricot";
  }, []);

  // Gère la connexion de l'utilisateur
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    // Empêche le comportement par défaut du formulaire
    e.preventDefault();
    setError("");

    // Indique que la connexion est en cours
    setLoading(true);
    try {
      // Envoie une requête de connexion à l'API
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.data.token;
      const user = response.data.data.user;

      // Nettoie l'ancien utilisateur et sauvegarde les nouvelles données
      localStorage.removeItem("user");
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        "Email ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      role="main"
      aria-label="Page de connexion"
      className="flex min-h-screen overflow-hidden bg-[#f3f3f3]"
    >
      {/* Partie gauche - Formulaire */}
      <section
        aria-labelledby="login-title"
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

        <div className="flex min-h-[600px] w-full max-w-[360px] flex-col">
          <h1
            id="login-title"
            className="mb-14 mt-4 text-center text-[58px] font-bold leading-none text-[#d45d00]"
          >
            Connexion
          </h1>

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-6"
          >
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="h-[54px] w-full rounded-[4px] border border-[#d8d8d8] bg-white px-4 text-[16px] text-[#1d1d1d] transition-all duration-200 focus:border-[#d45d00] focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2"
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <p
                role="alert"
                aria-live="assertive"
                className="text-[15px] text-red-600"
              >
                {error}
              </p>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="h-[58px] w-full rounded-[12px] bg-[#1f1f23] text-[24px] text-white transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2"
            >
              {loading
                ? "Connexion..."
                : "Se connecter"}
            </button>
          </form>

          {/* Pied de formulaire */}
          <nav
            aria-label="Liens de connexion"
            className="mt-auto text-center"
          >
            <button
              type="button"
              className="rounded-[4px] text-[18px] font-semibold text-[#9a3d00] underline transition-all hover:text-[#7a2f00] focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2"
            >
              Mot de passe oublié ?
            </button>

            <div className="mt-10 flex items-center justify-center gap-2 whitespace-nowrap text-[20px]">
              <span className="text-[#1d1d1d]">
                Pas encore de compte ?
              </span>

              <button
                type="button"
                onClick={() =>
                  router.push("/register")
                }
                className="rounded-[4px] font-semibold text-[#9a3d00] underline transition-all hover:text-[#7a2f00] focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2"
              >
                Créer un compte
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
          src={bannerLogin}
          alt="Illustration de la page de connexion"
          className="h-full w-full object-cover"
          priority
        />
      </aside>
    </main>
  );
}