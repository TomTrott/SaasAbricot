"use client";

import { LayoutDashboard, Folder, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoAbricot from "../../assets/logoabricot.png";
import api from "../../services/api";
// Composant de barre de navigation
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  // Récupère le profil utilisateur
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  // Extrait les initiales pour l'avatar
  const getInitials = () => {
    if (!user) return "";
    if (user.name) {
      const parts = user.name.trim().split(" ");
      return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
    }
    if (user.email) return user.email[0].toUpperCase();
    return "";
  };

  // Ferme le menu mobile avec Échap
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <nav className="w-full bg-white border-b border-[#ececec] sticky top-0 z-50" aria-label="Navigation principale">
        <div className="max-w-[1700px] mx-auto h-[82px] lg:h-[88px] px-4 sm:px-6 md:px-8 lg:px-14 xl:px-24 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 rounded-[12px]" aria-label="Retourner au tableau de bord">
            <Image src={logoAbricot} alt="Logo Abricot" className="w-[120px] sm:w-[135px] lg:w-[150px] object-contain cursor-pointer" priority />
          </Link>

          {/* Menu desktop */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            <Link href="/dashboard" aria-current={pathname === "/dashboard" ? "page" : undefined} className={`transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 ${pathname === "/dashboard" ? "h-[62px] px-7 xl:px-10 rounded-[14px] bg-[#050505] text-white flex items-center gap-3 text-[16px] xl:text-[18px] font-medium hover:scale-[1.02] hover:shadow-lg" : "flex items-center gap-3 text-[#b54700] text-[16px] xl:text-[22px] font-medium hover:opacity-80 rounded-[14px]"}`}>
              <LayoutDashboard size={pathname === "/dashboard" ? 24 : 26} aria-hidden="true" />
              <span>Tableau de bord</span>
            </Link>
            <Link href="/projects" aria-current={pathname === "/projects" ? "page" : undefined} className={`transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 ${pathname === "/projects" ? "h-[62px] px-7 xl:px-10 rounded-[14px] bg-[#050505] text-white flex items-center gap-3 text-[16px] xl:text-[18px] font-medium hover:scale-[1.02] hover:shadow-lg" : "flex items-center gap-3 text-[#b54700] text-[16px] xl:text-[22px] font-medium hover:opacity-80 rounded-[14px]"}`}>
              <Folder size={pathname === "/projects" ? 24 : 26} aria-hidden="true" />
              <span>Projets</span>
            </Link>
          </div>

          {/* Droite */}
          <div className="flex items-center gap-4">
            <Link href="/profile" aria-label="Accéder au profil utilisateur" className={`hidden sm:flex w-[54px] h-[54px] lg:w-[64px] lg:h-[64px] rounded-full items-center justify-center text-[18px] lg:text-[22px] font-medium transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 ${pathname === "/profile" ? "bg-[#d45d00] text-white" : "bg-[#f4e4d9] text-[#222]"}`}>
              {getInitials()}
            </Link>
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} className="lg:hidden w-[48px] h-[48px] rounded-[12px] border border-[#ececec] flex items-center justify-center text-[#1f1f1f] bg-white transition-all duration-300 hover:bg-[#fafafa] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30">
              {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu mobile" className={`fixed inset-0 z-[999] bg-white transition-all duration-500 lg:hidden ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="h-[82px] px-5 flex items-center justify-between border-b border-[#ececec]">
          <Link href="/dashboard" onClick={() => setOpen(false)} aria-label="Retourner au tableau de bord" className="focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 rounded-[12px]">
            <Image src={logoAbricot} alt="Logo Abricot" className="w-[120px] object-contain" priority />
          </Link>
          <button type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu" className="w-[48px] h-[48px] rounded-[12px] border border-[#ececec] flex items-center justify-center text-[#1f1f1f] transition-all duration-300 hover:bg-[#fafafa] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30">
            <X size={24} aria-hidden="true" />
          </button>
        </div>
        {/* Liens du menu mobile */}
        <div className="flex flex-col items-center justify-center h-[calc(100vh-82px)] gap-8 px-6">
          <Link href="/dashboard" onClick={() => setOpen(false)} aria-current={pathname === "/dashboard" ? "page" : undefined} className={`group flex items-center gap-4 text-[28px] font-semibold transition-all duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 rounded-[14px] px-4 py-3 ${pathname === "/dashboard" ? "text-[#b54700] scale-110" : "text-[#b54700]"} ${open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <LayoutDashboard size={32} aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-6" />
            <span>Tableau de bord</span>
          </Link>
          <Link href="/projects" onClick={() => setOpen(false)} aria-current={pathname === "/projects" ? "page" : undefined} className={`group flex items-center gap-4 text-[28px] font-semibold transition-all duration-500 delay-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 rounded-[14px] px-4 py-3 ${pathname === "/projects" ? "text-[#b54700] scale-110" : "text-[#b54700]"} ${open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <Folder size={32} aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-6" />
            <span>Projets</span>
          </Link>
          <Link href="/profile" onClick={() => setOpen(false)} aria-current={pathname === "/profile" ? "page" : undefined} className={`group flex items-center gap-4 text-[28px] font-semibold transition-all duration-500 delay-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 rounded-[14px] px-4 py-3 ${pathname === "/profile" ? "text-[#b54700] scale-110" : "text-[#b54700]"} ${open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="w-[54px] h-[54px] rounded-full bg-[#f4e4d9] flex items-center justify-center text-[18px] text-[#1f1f1f]">{getInitials()}</div>
            <span>Profil</span>
          </Link>
        </div>
      </div>
    </>
  );
}