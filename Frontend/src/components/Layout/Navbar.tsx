import { LayoutDashboard, Folder } from "lucide-react";
import logoAbricot from "../../assets/logoabricot.png";

export default function Navbar() {
  return (
    <nav className="w-full h-[88px] bg-white flex items-center justify-between px-10 border-b border-[#ececec]">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={logoAbricot}
          alt="Abricot"
          className="w-[150px]"
        />
      </div>

      {/* Menu centre */}
      <div className="flex items-center gap-10">
        {/* Active */}
        <button className="h-[78px] px-10 rounded-[14px] bg-[#050505] text-white flex items-center gap-4 text-[28px] font-medium">
          <LayoutDashboard size={30} />
          <span>Tableau de bord</span>
        </button>

        {/* Item */}
        <button className="flex items-center gap-4 text-[#d45d00] text-[28px] font-medium">
          <Folder size={30} />
          <span>Projets</span>
        </button>
      </div>

      {/* Avatar */}
      <div className="w-[64px] h-[64px] rounded-full bg-[#f4e4d9] flex items-center justify-center text-[24px] text-[#222]">
        AD
      </div>
    </nav>
  );
}