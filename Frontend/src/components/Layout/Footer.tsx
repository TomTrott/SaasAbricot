import Image from "next/image";
import logoAbricot from "../../assets/logoabricot.png";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#ececec] bg-white">
      <div
        className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8, lg:px-14
          xl:px-24 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Image
          src={logoAbricot}
          alt=""
          className="w-[110px] sm:w-[120px] opacity-90 object-contain"
        />

        {/* Texte */}
        <p className="text-[15px]  sm:text-[18px] lg:text-[20px]  text-[#222]  text-center">
          Abricot 2025
        </p>
      </div>
    </footer>
  );
}