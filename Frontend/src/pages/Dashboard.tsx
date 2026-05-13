import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      {/* Navbar */}
      <Navbar />

      {/* Contenu */}
      <main className="flex-1 px-10 py-10">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}