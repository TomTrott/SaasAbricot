"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import api from "@/services/api";

import bannerLogin from "@/assets/images/bannierelogin.png";
import logoAbricot from "@/assets/logoabricot.png";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.data.token;

      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f3f3f3] overflow-hidden">
      <div className="w-full lg:w-[39%] bg-[#f3f3f3] relative flex items-center justify-center px-8">
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <Image src={logoAbricot} alt="Logo Abricot" className="w-[320px] h-auto" priority />
        </div>

        <div className="w-full max-w-[360px] flex flex-col min-h-[600px]">
          <h1 className="text-[58px] font-bold text-[#d45d00] mb-14 mt-4 leading-none text-center">
            Connexion
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label htmlFor="email" className="block text-[18px] text-[#1d1d1d] mb-3">
                Email
              </label>

              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-[54px] border border-[#d8d8d8] rounded-[4px] bg-white px-4 text-[16px] text-[#1d1d1d] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2 focus:border-[#d45d00]" />
            </div>

            <div>
              <label htmlFor="password" className="block text-[18px] text-[#1d1d1d] mb-3">
                Mot de passe
              </label>

              <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-[54px] border border-[#d8d8d8] rounded-[4px] bg-white px-4 text-[16px] text-[#1d1d1d] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2 focus:border-[#d45d00]" />
            </div>

            {error && (
              <p role="alert" aria-live="assertive" className="text-red-600 text-[15px]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full h-[58px] bg-[#1f1f23] hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 rounded-[12px] text-white text-[24px] focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-auto text-center">
            <button
              type="button"
              className="text-[#c45100] underline text-[18px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2 rounded-[4px]"
            >
              Mot de passe oublié ?
            </button>

            <div className="flex items-center justify-center gap-2 text-[20px] mt-10 whitespace-nowrap">
              <span className="text-[#1d1d1d]">
                Pas encore de compte ?
              </span>

              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-[#c45100] underline font-semibold focus:outline-none focus:ring-2 focus:ring-[#d45d00] focus:ring-offset-2 rounded-[4px]"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[61%] h-screen">
        <Image
          src={bannerLogin}
          alt="Illustration de la page de connexion"
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  );
}