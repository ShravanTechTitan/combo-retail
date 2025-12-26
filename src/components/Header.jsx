import SidebarMenu from "../components/userComponents/SideBar"; 
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const navigate = useNavigate();

  const HandleClickLogo = () => {
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] h-16 flex justify-between items-center 
                       bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-900 dark:to-gray-800 
                       px-4 sm:px-6 shadow-lg transition-colors duration-300">
      {/* Logo + Brand */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none relative z-[101]"
        onClick={HandleClickLogo}
      >
        <img
          src="/UniversalCombo.jpg"
          alt="Universal Combo Logo"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shadow-md border-2 border-white"
        />
        <h1 className="lg:text-xl sm:text-base font-bold  tracking-wide">
          <span className="text-blue-400">UNIVERSAL</span>
          <span className="text-orange-400">COMBO</span>
        </h1>
      </div>

      <div className="flex flex-row items-center gap-2 sm:gap-3 relative z-[101]">
        {/* Notification Bell - Only show if logged in */}
        {localStorage.getItem("token") && <NotificationBell />}
        
        {/* Full button on larger screens */}
        <button
          onClick={() => localStorage.getItem("token") ? navigate("/subscribe") : navigate("/login")}
          className="bg-green-600 text-white px-3 py-2 mr-10 sm:px-5 py-1 sm:py-2 rounded-lg hover:bg-green-700 hidden sm:block text-sm sm:text-base relative z-[101]"
        >
          Subscribe Now
        </button>

        {/* Compact button on mobile */}
        <button
          onClick={() => localStorage.getItem("token") ? navigate("/subscribe") : navigate("/login")}
          className="bg-green-600 text-white px-2.5 py-2 mr-10 rounded-lg hover:bg-green-700 sm:hidden text-xs relative z-[101]"
        >
          Subscribe
        </button>

        {/* Sidebar Menu */}
        <div className="relative z-[101]">
          <SidebarMenu>
            <Menu className="text-white w-6 h-6" />
          </SidebarMenu>
        </div>
      </div>

    </header>
  );
}
