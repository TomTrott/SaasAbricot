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

      return parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0][0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "";
  };

  // Ferme le menu mobile avec Échap
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full border-b border-[#ececec] bg-white"
        aria-label="Navigation principale"
      >
        <div className="mx-auto flex h-[82px] max-w-[1700px] items-center justify-between px-4 sm:px-6 md:px-8 lg:h-[88px] lg:px-14 xl:px-24">

          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center rounded-[12px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30"
            aria-label="Retourner au tableau de bord"
          >
            <Image
              src={logoAbricot}
              alt=""
              className="w-[120px] cursor-pointer object-contain sm:w-[135px] lg:w-[150px]"
              priority
            />
          </Link>

          {/* Menu desktop */}
          <div className="hidden items-center gap-6 lg:flex xl:gap-10">

            <Link
              href="/dashboard"
              aria-current={
                pathname === "/dashboard" ? "page" : undefined
              }
              className={`transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 ${pathname === "/dashboard"
                  ? "flex h-[62px] items-center gap-3 rounded-[14px] bg-[#050505] px-7 text-[16px] font-medium text-white hover:scale-[1.02] hover:shadow-lg xl:px-10 xl:text-[18px]"
                  : "flex items-center gap-3 rounded-[14px] text-[16px] font-medium text-[#b54700] hover:opacity-80 xl:text-[22px]"
                }`}
            >
              <LayoutDashboard
                size={pathname === "/dashboard" ? 24 : 26}
                aria-hidden="true"
              />

              <span>Tableau de bord</span>
            </Link>

            <Link
              href="/projects"
              aria-current={
                pathname === "/projects" ? "page" : undefined
              }
              className={`transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 ${pathname === "/projects"
                  ? "flex h-[62px] items-center gap-3 rounded-[14px] bg-[#050505] px-7 text-[16px] font-medium text-white hover:scale-[1.02] hover:shadow-lg xl:px-10 xl:text-[18px]"
                  : "flex items-center gap-3 rounded-[14px] text-[16px] font-medium text-[#b54700] hover:opacity-80 xl:text-[22px]"
                }`}
            >
              <Folder
                size={pathname === "/projects" ? 24 : 26}
                aria-hidden="true"
              />

              <span>Projets</span>
            </Link>
          </div>

          {/* Partie droite */}
          <div className="flex items-center gap-4">

            {/* Avatar desktop */}
            <Link
              href="/profile"
              aria-label="Accéder au profil utilisateur"
              className={`hidden items-center justify-center rounded-full text-[18px] font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 sm:flex lg:h-[64px] lg:w-[64px] lg:text-[22px] ${pathname === "/profile"
                  ? "bg-[#8a3600] text-white"
                  : "bg-[#f4e4d9] text-[#222]"
                } h-[54px] w-[54px]`}
            >
              {getInitials()}
            </Link>

            {/* Bouton menu mobile */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={
                open ? "Fermer le menu" : "Ouvrir le menu"
              }
              className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] border border-[#ececec] bg-white text-[#1f1f1f] transition-all duration-300 hover:bg-[#fafafa] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 lg:hidden"
            >
              {open ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu mobile"
        className={`fixed inset-0 z-[999] bg-white transition-all duration-500 lg:hidden ${open
            ? "visible opacity-100"
            : "invisible opacity-0"
          }`}
      >
        {/* Header mobile */}
        <div className="flex h-[82px] items-center justify-between border-b border-[#ececec] px-5">

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            aria-label="Retourner au tableau de bord"
            className="rounded-[12px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30"
          >
            <Image
              src={logoAbricot}
              alt=""
              className="w-[120px] object-contain"
              priority
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] border border-[#ececec] text-[#1f1f1f] transition-all duration-300 hover:bg-[#fafafa] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        {/* Liens mobile */}
        <div className="flex h-[calc(100vh-82px)] flex-col items-center justify-center gap-8 px-6">

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            aria-current={
              pathname === "/dashboard" ? "page" : undefined
            }
            className={`group flex items-center gap-4 rounded-[14px] px-4 py-3 text-[28px] font-semibold transition-all duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 ${pathname === "/dashboard"
                ? "scale-110 text-[#b54700]"
                : "text-[#b54700]"
              } ${open
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
              }`}
          >
            <LayoutDashboard
              size={32}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:rotate-6"
            />

            <span>Tableau de bord</span>
          </Link>

          <Link
            href="/projects"
            onClick={() => setOpen(false)}
            aria-current={
              pathname === "/projects" ? "page" : undefined
            }
            className={`group flex items-center gap-4 rounded-[14px] px-4 py-3 text-[28px] font-semibold transition-all duration-500 delay-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 ${pathname === "/projects"
                ? "scale-110 text-[#b54700]"
                : "text-[#b54700]"
              } ${open
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
              }`}
          >
            <Folder
              size={32}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:rotate-6"
            />

            <span>Projets</span>
          </Link>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            aria-current={
              pathname === "/profile" ? "page" : undefined
            }
            className={`group flex items-center gap-4 rounded-[14px] px-4 py-3 text-[28px] font-semibold transition-all duration-500 delay-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d45d00]/30 ${pathname === "/profile"
                ? "scale-110 text-[#b54700]"
                : "text-[#b54700]"
              } ${open
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
              }`}
          >
            <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#f4e4d9] text-[18px] text-[#1f1f1f]">
              {getInitials()}
            </div>

            <span>Profil</span>
          </Link>
        </div>
      </div>
    </>
  );
}