"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/services/api";
import bannerRegister from "@/assets/images/banniereregister.png";
import logoAbricot from "@/assets/logoabricot.png";
// Page d'inscription
export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Gère l'inscription de l'utilisateur
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", { email, password });
      router.push("/login");
    } catch (error) {
      console.error(error);
      setError("Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f3f3f3] overflow-hidden">
      {/* Partie gauche - Formulaire */}
      <div className="w-full lg:w-[39%] bg-[#f3f3f3] relative flex items-center justify-center px-8">
        {/* Logo */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <Image src={logoAbricot} alt="Logo Abricot" className="w-[320px] h-auto" priority />
        </div>

        <div className="w-full max-w-[360px]">
          <h1 className="text-[58px] font-bold text-[#d45d00] mb-14 leading-none text-center">Inscription</h1>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[18px] text-[#1d1d1d] mb-3">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} className="w-full h-[54px] border border-[#d8d8d8] rounded-[4px] bg-white px-4 text-[16px] text-[#1d1d1d] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2 focus:border-[#d45d00]" />
            </div>

            <div>
              <label htmlFor="password"
                className="block text-[18px] text-[#1d1d1d] mb-3">Mot de passe</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[54px] border border-[#d8d8d8] rounded-[4px] bg-white px-4 text-[16px] text-[#1d1d1d] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2 focus:border-[#d45d00]" />
            </div>

            {error && <p role="alert" aria-live="assertive"
              className="text-red-600 text-[15px]">{error}</p>}

            <button type="submit" disabled={loading} aria-busy={loading}
              className="w-full h-[58px] bg-[#1f1f23] hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 rounded-[12px] text-white text-[24px] focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2">
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-[20px] mt-20 whitespace-nowrap">
            <span className="text-[#1d1d1d]">Déjà inscrit ?</span>
            <button type="button"
              onClick={() => router.push("/login")}
              className="text-[#c45100] underline font-semibold focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2 rounded-[4px]">
              Se connecter
            </button>
          </div>
        </div>
      </div>

      {/* Partie droite - Illustration (masquée sur mobile) */}
      <div className="hidden lg:block lg:w-[61%] h-screen">
        <Image src={bannerRegister} alt="Illustration de la page d'inscription" className="w-full h-full object-cover" priority />
      </div>
    </div>
  );
}