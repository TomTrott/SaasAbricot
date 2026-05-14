// src/components/pages/ProjectsPage.tsx
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import ProjectGrid from "../Projects/ProjectGrid";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
      <Navbar />

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8 lg:px-14 xl:px-24 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-[28px] sm:text-[32px] lg:text-[38px] font-bold text-[#1f1f1f] mb-2 leading-tight">
              Mes projets
            </h1>

            <p className="text-[15px] sm:text-[17px] lg:text-[18px] text-[#1f1f1f] leading-relaxed">
              Gérez vos projets
            </p>
          </div>

          <button className="w-full sm:w-fit whitespace-nowrap bg-[#1f1f23] text-white h-[54px] px-7 rounded-[14px] text-[16px] sm:text-[18px] lg:text-[20px] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-black active:scale-[0.98]">
            + Créer un projet
          </button>
        </div>

        <ProjectGrid />
      </main>

      <Footer />
    </div>
  );
}