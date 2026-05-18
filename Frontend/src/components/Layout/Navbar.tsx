"use client";

import { LayoutDashboard, Folder, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoAbricot from "../../assets/logoabricot.png";
import api from "../../services/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const pathname = usePathname();

  useEffect(() => {
    fetchProfile();
  }, []);
// fonction pour récupérer les données de l'utilisateur connecté
  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data.data.user);
    } catch (error) {
      console.error(error);
    }
  };
// fonction pour récupérer les initiales de l'utilisateur à afficher dans l'avatar
  const getInitials = () => {
    if (!user) return "";

    if (user.name) {
      const parts = user.name.trim().split(" ");

      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }

      return parts[0][0].toUpperCase();
    }

    if (user.email) {
      return user.email[0].toUpperCase();
    }

    return "";
  };

  return (
    <nav className="w-full bg-white border-b border-[#ececec] sticky top-0 z-50">
      <div className="max-w-[1700px] mx-auto h-[82px] lg:h-[88px] px-4 sm:px-6 md:px-8 lg:px-14 xl:px-24 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={logoAbricot}
            alt="Abricot"
            className="w-[120px] sm:w-[135px] lg:w-[150px] object-contain"
            priority
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`transition-all duration-300 ${
              pathname === "/dashboard"
                ? "h-[62px] px-7 xl:px-10 rounded-[14px] bg-[#050505] text-white flex items-center gap-3 text-[16px] xl:text-[18px] font-medium hover:scale-[1.02] hover:shadow-lg"
                : "flex items-center gap-3 text-[#d45d00] text-[16px] xl:text-[22px] font-medium hover:opacity-80"
            }`}
          >
            <LayoutDashboard size={pathname === "/dashboard" ? 24 : 26} />
            <span>Tableau de bord</span>
          </Link>

          {/* Projects */}
          <Link
            href="/projects"
            className={`transition-all duration-300 ${
              pathname === "/projects"
                ? "h-[62px] px-7 xl:px-10 rounded-[14px] bg-[#050505] text-white flex items-center gap-3 text-[16px] xl:text-[18px] font-medium hover:scale-[1.02] hover:shadow-lg"
                : "flex items-center gap-3 text-[#d45d00] text-[16px] xl:text-[22px] font-medium hover:opacity-80"
            }`}
          >
            <Folder size={pathname === "/projects" ? 24 : 26} />
            <span>Projets</span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Link
            href="/profile"
            className={`hidden sm:flex w-[54px] h-[54px] lg:w-[64px] lg:h-[64px] rounded-full items-center justify-center text-[18px] lg:text-[22px] font-medium transition-all duration-300 hover:scale-105 cursor-pointer ${
              pathname === "/profile"
                ? "bg-[#d45d00] text-white"
                : "bg-[#f4e4d9] text-[#222]"
            }`}
          >
            {getInitials()}
          </Link>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-[48px] h-[48px] rounded-[12px] border border-[#ececec] flex items-center justify-center text-[#1f1f1f]"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-[#ececec] bg-white px-4 py-5 flex flex-col gap-4">
          {/* Dashboard Mobile */}
          <Link
            href="/dashboard"
            className={`transition-all duration-300 ${
              pathname === "/dashboard"
                ? "w-full h-[56px] rounded-[14px] bg-[#050505] text-white flex items-center gap-3 px-5 text-[16px] font-medium"
                : "w-full h-[56px] rounded-[14px] border border-[#ececec] text-[#d45d00] flex items-center gap-3 px-5 text-[16px] font-medium"
            }`}
          >
            <LayoutDashboard size={22} />
            <span>Tableau de bord</span>
          </Link>

          {/* Projects Mobile */}
          <Link
            href="/projects"
            className={`transition-all duration-300 ${
              pathname === "/projects"
                ? "w-full h-[56px] rounded-[14px] bg-[#050505] text-white flex items-center gap-3 px-5 text-[16px] font-medium"
                : "w-full h-[56px] rounded-[14px] border border-[#ececec] text-[#d45d00] flex items-center gap-3 px-5 text-[16px] font-medium"
            }`}
          >
            <Folder size={22} />
            <span>Projets</span>
          </Link>

          {/* Profile Mobile */}
          <Link
            href="/profile"
            className={`transition-all duration-300 ${
              pathname === "/profile"
                ? "w-full h-[56px] rounded-[14px] bg-[#d45d00] text-white flex items-center gap-3 px-5 text-[16px] font-medium"
                : "w-full h-[56px] rounded-[14px] border border-[#ececec] text-[#d45d00] flex items-center gap-3 px-5 text-[16px] font-medium"
            }`}
          >
            <span>{getInitials()} - Profil</span>
          </Link>
        </div>
      )}
    </nav>
  );
}