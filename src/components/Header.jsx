import SidebarMenu from "../components/userComponents/SideBar"; // ✅ Sidebar
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const HandleClickLogo = () => {
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-900 dark:to-gray-800 px-6 shadow-lg">
      {/* 🔹 Logo + Title */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={HandleClickLogo}
      >
        <img
          src="/UniversalCombo.jpg"
          alt="Universal Combo Logo"
          className="h-10 w-10 rounded-full shadow-md border-2 border-white"
        />
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Universal Combo
        </h1>
      </div>

      {/* 🔹 Sidebar Toggle Button */}
      <SidebarMenu />
    </header>
  );
}
