"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import bannerRegister from "@/assets/images/banniereregister.png";
import logoAbricot from "@/assets/logoabricot.png";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        email,
        password,
      });

      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Erreur inscription");
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
            Inscription
          </h1>
          {/* email */}
          <div className="mb-6">
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
          {/* mot de passe */}
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
            onClick={handleRegister}
            className="w-full h-[58px] bg-[#1f1f23] hover:bg-black transition-all duration-200 rounded-[12px] text-white text-[24px]"
          >
            S'inscrire
          </button>

          <div className="flex items-center justify-center gap-2 text-[20px] mt-32 whitespace-nowrap">
            <span className="text-[#1d1d1d]">
              Déjà inscrit ?
            </span>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-[#ff6b00] underline"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[61%] h-screen">
        <Image
          src={bannerRegister}
          alt="Bannière inscription"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}