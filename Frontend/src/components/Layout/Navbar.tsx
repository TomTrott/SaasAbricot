import { LayoutDashboard, Folder, Menu, } from "lucide-react";
import { useState } from "react";
import logoAbricot from "../../assets/logoabricot.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "projects"
  >("dashboard");

  return (
    <nav className="w-full bg-white border-b border-[#ececec] sticky top-0 z-50">
      <div className="max-w-[1700px] mx-auto h-[82px] lg:h-[88px] px-4 sm:px-6 md:px-8 lg:px-14 xl:px-24 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logoAbricot}
            alt="Abricot"
            className="w-[120px] sm:w-[135px] lg:w-[150px] object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          {/* dashboard button */}
          <button
            onClick={() =>
              setActiveTab("dashboard")
            }
            className={`transition-all duration-300 ${
              activeTab === "dashboard"
                ? "h-[62px] px-7 xl:px-10 rounded-[14px] bg-[#050505] text-white flex items-center gap-3 text-[16px] xl:text-[18px] font-medium hover:scale-[1.02] hover:shadow-lg"
                : "flex items-center gap-3 text-[#d45d00] text-[18px] xl:text-[22px] font-medium hover:opacity-80"
            }`}
          >
            <LayoutDashboard
              size={
                activeTab === "dashboard"
                  ? 24
                  : 26
              }
            />

            <span>Tableau de bord</span>
          </button>

          {/* projets button */}
          <button
            onClick={() =>
              setActiveTab("projects")
            }
            className={`transition-all duration-300 ${
              activeTab === "projects"
                ? "h-[62px] px-7 xl:px-10 rounded-[14px] bg-[#050505] text-white flex items-center gap-3 text-[16px] xl:text-[18px] font-medium hover:scale-[1.02] hover:shadow-lg"
                : "flex items-center gap-3 text-[#d45d00] text-[18px] xl:text-[22px] font-medium hover:opacity-80"
            }`}
          >
            <Folder
              size={
                activeTab === "projects"
                  ? 24
                  : 26
              }
            />

            <span>Projets</span>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="hidden sm:flex w-[54px] h-[54px] lg:w-[64px] lg:h-[64px] rounded-full bg-[#f4e4d9] items-center justify-center text-[18px] lg:text-[22px] text-[#222] font-medium transition-all duration-300 hover:scale-105">
            AD
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-[48px] h-[48px] rounded-[12px] border border-[#ececec] flex items-center justify-center text-[#1f1f1f]"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden border-t border-[#ececec] bg-white px-4 py-5 flex flex-col gap-4">
          {/* dashboard mobile */}
          <button
            onClick={() =>
              setActiveTab("dashboard")
            }
            className={`transition-all duration-300 ${
              activeTab === "dashboard"
                ? "w-full h-[56px] rounded-[14px] bg-[#050505] text-white flex items-center gap-3 px-5 text-[16px] font-medium"
                : "w-full h-[56px] rounded-[14px] border border-[#ececec] text-[#d45d00] flex items-center gap-3 px-5 text-[16px] font-medium"
            }`}
          >
            <LayoutDashboard size={22} />
            <span>Tableau de bord</span>
          </button>

          {/* projets mobile */}
          <button
            onClick={() =>
              setActiveTab("projects")
            }
            className={`transition-all duration-300 ${
              activeTab === "projects"
                ? "w-full h-[56px] rounded-[14px] bg-[#050505] text-white flex items-center gap-3 px-5 text-[16px] font-medium"
                : "w-full h-[56px] rounded-[14px] border border-[#ececec] text-[#d45d00] flex items-center gap-3 px-5 text-[16px] font-medium"
            }`}
          >
            <Folder size={22} />
            <span>Projets</span>
          </button>
        </div>
      )}
    </nav>
  );
}