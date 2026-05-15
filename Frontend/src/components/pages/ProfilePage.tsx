"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import api from "@/services/api";

type User = {
  id: string;
  email: string;
  name: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Request profile from backend
        const response = await api.get("/auth/profile");
        // Save user in state
        setUser(response.data.data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Split fullname into firstname / lastname
  const fullName = user?.name || "";
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <p className="text-[#1f1f1f] text-[18px]">
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">

      <Navbar />

      {/* Page */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-8">

        {/* Container */}
        <div className="max-w-[1100px] mx-auto bg-white border border-[#e7e7e7] rounded-[18px] p-6 sm:p-8 lg:p-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-semibold text-[#1f1f1f]">
              Mon compte
            </h1>
            <p className="text-[#8b8f98] text-[17px] mt-1">
              {user?.name}
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6">

            {/* Last Name */}
            <div>
              <label className="block text-[15px] text-[#1f1f1f] mb-2">
                Nom
              </label>
              <input
                type="text"
                defaultValue={lastName}
                className="w-full h-[58px] border border-[#e5e5e5] rounded-[10px] px-4 outline-none text-[15px] text-[#1f1f1f] focus:border-[#d45d00]"
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-[15px] text-[#1f1f1f] mb-2">
                Prénom
              </label>
              <input
                type="text"
                defaultValue={firstName}
                className="w-full h-[58px] border border-[#e5e5e5] rounded-[10px] px-4 outline-none text-[15px] text-[#1f1f1f] focus:border-[#d45d00]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[15px] text-[#1f1f1f] mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full h-[58px] border border-[#e5e5e5] rounded-[10px] px-4 outline-none text-[15px] text-[#1f1f1f] focus:border-[#d45d00]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[15px] text-[#1f1f1f] mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-[58px] border border-[#e5e5e5] rounded-[10px] px-4 outline-none text-[15px] text-[#1f1f1f] focus:border-[#d45d00]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 w-fit h-[54px] px-7 rounded-[12px] bg-[#1f1f1f] text-white text-[16px] font-medium transition-all duration-300 hover:bg-black hover:scale-[1.02] hover:shadow-lg"
            >
              Modifier les informations
            </button>

          </form>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}