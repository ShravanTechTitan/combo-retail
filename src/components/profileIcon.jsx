import { Link ,useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { MdDarkMode, MdDashboard } from "react-icons/md";

export default function ProfileIcon() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);
const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Handle theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
   const navigate = useNavigate();
  



const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  setMenuOpen(false);
  setIsLoggedIn(false);
  navigate("/")
};



  // Handle outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Icon */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-3xl text-white hover:text-gray-200 transition"
      >
        <FaUserCircle />
      </button>

      {/* Dropdown */}
      {menuOpen && (
       <div
  className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-xl overflow-hidden text-sm z-50"
>
  {!isLoggedIn ? (
    <span>
    <Link
      to="/login"
      className="flex items-center gap-2 px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
    >
      <FiLogIn className="text-blue-500" /> Login
    </Link>
   
  </span>
  ) : (
    <span>
    <button
      onClick={() => setShowLogoutPopup(true)}
      className="flex items-center gap-2 w-full text-left px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
    >
      <FiLogIn className="text-red-500" /> Logout
    </button>
     <Link
    to="/dashboard"
    className="flex items-center gap-2 px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
  >
    <MdDashboard className="text-green-500" /> Dashboard
  </Link>
    </span>
  )}

  
  
</div>



      )}

{showLogoutPopup && (
  <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 w-80 shadow-lg text-center space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Confirm Logout
      </h3>
      <p className="text-gray-700 dark:text-gray-300">
        Are you sure you want to logout?
      </p>
      <div className="flex justify-between gap-4">
        <button
          onClick={() => setShowLogoutPopup(false)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleLogout();
            setShowLogoutPopup(false);
          }}
          className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
