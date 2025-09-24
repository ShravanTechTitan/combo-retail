import SidebarMenu from "../components/userComponents/SideBar"; 
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Moon, Sun, Menu } from "lucide-react"; // ✅ Clean icons

export default function Header() {
  const navigate = useNavigate();
 

  const HandleClickLogo = () => {
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 flex justify-between items-center 
                       bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-900 dark:to-gray-800 
                       px-6 shadow-lg transition-colors duration-300">
      {/* 🔹 Logo + Brand */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={HandleClickLogo}
      >
        <img
          src="/UniversalCombo.jpg"
          alt="Universal Combo Logo"
          className="h-10 w-10 rounded-full shadow-md border-2 border-white"
        />
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
          <span className="text-blue-400">UNIVERSAL</span>
          <span className="text-orange-400">COMBO</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
  {/* ✅ Subscribe button */}
  <button 
    onClick={() => navigate("/subscribe")} 
    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 
               hidden sm:block"   // hide on very small screens
  >
    Subscribe Now
  </button>

  {/* ✅ Compact icon for mobile */}
  <button 
    onClick={() => navigate("/subscribe")}
    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 sm:hidden"
  >
    <span className="text-sm font-semibold">Subscribe</span>
  </button>

  {/* ✅ Sidebar Menu */}
  <div className="px-3">
    <SidebarMenu>
      <Menu className="text-white w-6 h-6" />
    </SidebarMenu>
  </div>
</div>


    </header>
  );
}
