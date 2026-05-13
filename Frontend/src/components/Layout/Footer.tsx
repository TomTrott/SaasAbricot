import logoAbricot from "../../assets/logoabricot.png";

export default function Footer() {
  return (
    <footer className="w-full h-[72px] bg-white border-t border-[#ececec] flex items-center justify-between px-10">
      {/* Logo */}
      <img
        src={logoAbricot}
        alt="Abricot"
        className="w-[120px] opacity-90"
      />

      {/* Texte */}
      <p className="text-[20px] text-[#222]">
        Abricot 2025
      </p>
    </footer>
  );
}