// src/components/pages/LoginPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/services/api";

import bannerLogin from "@/assets/images/bannierelogin.png";
import logoAbricot from "@/assets/logoabricot.png";

import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
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
      alert("Erreur login");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f3f3f3] overflow-hidden">
      <div className="w-full lg:w-[39%] bg-[#f3f3f3] relative flex items-center justify-center px-8">
        <div className="absolute top-32 left-1/2 -translate-x-1/2">
          <Image
            src={logoAbricot}
            alt="Abricot"
            className="w-[320px]"
          />
        </div>

        <div className="w-full max-w-[360px]">
          <h1 className="text-[58px] font-bold text-[#d45d00] mb-14 leading-none text-center">
            Connexion
          </h1>

          <div className="mb-8">
            <label className="block text-[18px] text-[#1d1d1d] mb-3">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[54px] border border-[#d8d8d8] rounded-[4px] bg-white px-4 text-[16px] outline-none focus:border-[#d45d00]"
            />
          </div>

          <div className="mb-8">
            <label className="block text-[18px] text-[#1d1d1d] mb-3">
              Mot de passe
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[54px] border border-[#d8d8d8] rounded-[4px] bg-white px-4 text-[16px] outline-none focus:border-[#d45d00]"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full h-[58px] bg-[#1f1f23] hover:bg-black transition-all duration-200 rounded-[12px] text-white text-[24px]"
          >
            Se connecter
          </button>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-[#d45d00] underline text-[18px]"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[20px] mt-32 whitespace-nowrap">
            <span className="text-[#1d1d1d]">
              Pas encore de compte ?
            </span>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-[#ff6b00] underline"
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[61%] h-screen">
        <Image
          src={bannerLogin}
          alt="Bannière connexion"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}