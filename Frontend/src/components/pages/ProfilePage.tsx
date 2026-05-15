import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">

      {/* Navigation */}
      <Navbar />

      {/* Page */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-8">

        {/* Container */}
        <div className="max-w-[1100px] mx-auto bg-white border border-[#e7e7e7] rounded-[18px] p-6 sm:p-8 lg:p-10">

          {/* Header */}
          <div className="mb-8">

            {/* Title */}
            <h1 className="text-[28px] font-semibold text-[#1f1f1f]">
              Mon compte
            </h1>

            {/* Subtitle */}
            <p className="text-[#8b8f98] text-[17px] mt-1">
              Amélie Dupont
            </p>

          </div>

          {/* Form */}
          <form className="flex flex-col gap-6">

            {/* Last Name */}
            <div>

              {/* Label */}
              <label className="block text-[15px] text-[#1f1f1f] mb-2">
                Nom
              </label>

              {/* Input */}
              <input type="text" defaultValue="Dupont" className="w-full h-[58px] border border-[#e5e5e5] rounded-[10px] px-4 outline-none text-[15px] text-[#1f1f1f] focus:border-[#d45d00]" />

            </div>

            {/* First Name */}
            <div>

              {/* Label */}
              <label className="block text-[15px] text-[#1f1f1f] mb-2">
                Prénom
              </label>

              {/* Input */}
              <input type="text" defaultValue="Amélie" className="w-full h-[58px] border border-[#e5e5e5] rounded-[10px] px-4 outline-none text-[15px] text-[#1f1f1f] focus:border-[#d45d00]" />

            </div>

            {/* Email */}
            <div>

              {/* Label */}
              <label className="block text-[15px] text-[#1f1f1f] mb-2">
                Email
              </label>

              {/* Input */}
              <input type="email" defaultValue="a.dupont@mail.com" className="w-full h-[58px] border border-[#e5e5e5] rounded-[10px] px-4 outline-none text-[15px] text-[#1f1f1f] focus:border-[#d45d00]" />

            </div>

            {/* Password */}
            <div>

              {/* Label */}
              <label className="block text-[15px] text-[#1f1f1f] mb-2">
                Mot de passe
              </label>

              {/* Input */}
              <input type="password" defaultValue="password123" className="w-full h-[58px] border border-[#e5e5e5] rounded-[10px] px-4 outline-none text-[15px] text-[#1f1f1f] focus:border-[#d45d00]" />

            </div>

            {/* Submit Button */}
            <button
              type="submit" className="mt-2 w-fit h-[54px] px-7 rounded-[12px] bg-[#1f1f1f] text-white text-[16px] font-medium transition-all duration-300 hover:bg-black hover:scale-[1.02] hover:shadow-lg">
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