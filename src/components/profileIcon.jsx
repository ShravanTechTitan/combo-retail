import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { MdDashboard, MdSubscriptions } from "react-icons/md";

export default function ProfileIcon() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const token = localStorage.getItem("token");
  const initialRole = token ? parseJwt(token)?.role : null;
  const [userRole, setUserRole] = useState(initialRole);

  const navigate = useNavigate();

  // Decode JWT payload safely
  function parseJwt(token) {
    try {
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (e) {
      console.error("JWT parse failed", e);
      return null;
    }
  }

  // Get user role from JWT
  useEffect(() => {
    if (isLoggedIn && !userRole) {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = parseJwt(token);
        if (decoded?.role) {
          setUserRole(decoded.role);
        }
      }
    }
  }, [isLoggedIn, userRole]);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("rzp_checkout_anon_id");
    setMenuOpen(false);
    setIsLoggedIn(false);
    setUserRole(null);
    console.log(localStorage)
    navigate("/");
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
       <div className="absolute right-0 top-12 w-52 bg-white dark:bg-gray-700 shadow-lg rounded-xl overflow-hidden text-sm z-50">
  {!isLoggedIn ? (
    <Link
      to="/login"
      className="flex items-center gap-2 px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
    >
      <FiLogIn className="text-blue-500" /> Login
    </Link>
  ) : (
    <>
      <button
        onClick={() => setShowLogoutPopup(true)}
        className="flex items-center gap-2 w-full text-left px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
      >
        <FiLogIn className="text-red-500" /> Logout
      </button>

      {(userRole === "admin" || userRole === "superadmin") && (
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <MdDashboard className="text-green-500" /> Dashboard
        </Link>
      )}
    </>
  )}

  {/* ✅ Always visible links */}
  <Link
    to="/subscribe"
    className="flex items-center gap-2 px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
  >
    <MdSubscriptions className="text-purple-500" /> Subscribe
  </Link>

  <Link
    to="/contact"
    className="flex items-center gap-2 px-3 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
  >
    <MdSubscriptions className="text-indigo-500" /> Contact Us
  </Link>
</div>

      )}

      {/* Logout Confirmation Modal */}
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
