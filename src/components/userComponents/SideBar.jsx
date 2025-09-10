import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaInfoCircle,
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaGoogle,
  FaSnapchat,
  FaUserCircle,
} from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

export default function SidebarMenu() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const navigate = useNavigate();

  // Decode JWT
  function parseJwt(token) {
    try {
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = parseJwt(token);
        if (decoded?.role) setUserRole(decoded.role);
        if (decoded?.name) setUserName(decoded.name); // assuming JWT has a 'name' field
      }
    }, []);
    

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setUserRole(null);
    setOpen(false);
    navigate("/");
  };

  // ✅ Reusable Button Classes
  const menuItemClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition";

  return (
    <>
      {/* Toggle Button - shifted top-right corner */}
      <button
        className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-3 py-2 rounded-full shadow-lg hover:bg-gray-800 transition"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* 🔹 Background Blur Overlay */}
      {open && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/40 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 
        bg-[rgba(15,23,42,0.92)] backdrop-blur-md 
        text-white transform ${
          open ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-xl flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-600/40 px-4 py-3">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-orange-400 text-transparent bg-clip-text">
            Main Menu
          </h3>
          <button
            className="text-white text-xl hover:text-cyan-300"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* ✅ Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-6">
            <FaUserCircle className="text-6xl text-gray-300" />
            <p className="mt-2 text-gray-200 font-medium">
              {isLoggedIn ? `Hello, ${userName || "User"}` : "Guest"}
            </p>

          </div>

          {/* Menu List */}
          <ul className="space-y-2">
            <li>
              <Link to="/" onClick={() => setOpen(false)} className={menuItemClass}>
                <FaHome className="text-cyan-400" /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className={menuItemClass}
              >
                <FaUser className="text-orange-400" /> My Profile
              </Link>
            </li>

            {/* ✅ Membership points to /subscribe */}
            <li>
              <Link
                to="/subscribe"
                onClick={() => setOpen(false)}
                className={menuItemClass}
              >
                <FaIdCard className="text-green-400" /> Membership
              </Link>
            </li>

            {/* ✅ Logout above Contact & About */}
           {/* Auth Links */}
            {!isLoggedIn ? (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className={menuItemClass}
              >
                <FiLogIn className="text-blue-400" /> Login
              </Link>
            ) : (
              <>
                {(userRole === "admin" || userRole === "superadmin") && (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className={menuItemClass}
                  >
                    <MdDashboard className="text-green-400" /> Dashboard
                  </Link>
                )}
            
                <button
                  onClick={() => setShowLogoutPopup(true)}
                  className={menuItemClass + " w-full text-left"}
                >
                  <FiLogIn className="text-red-400" /> Logout
                </button>
              </>
            )}


            <li>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className={menuItemClass}
              >
                <FaEnvelope className="text-red-400" /> Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className={menuItemClass}
              >
                <FaInfoCircle className="text-purple-400" /> About Me
              </Link>
            </li>
          </ul>
        </div>

        {/* ✅ Social Links (Fixed Bottom) */}
        <div className="border-t border-gray-600/40 px-6 py-4">
          <p className="font-medium mb-2 text-gray-300">Follow Us On</p>
          <div className="flex flex-wrap gap-4 text-2xl">
            <FaInstagram className="cursor-pointer text-pink-500 hover:scale-110 transition" />
            <FaWhatsapp className="cursor-pointer text-green-500 hover:scale-110 transition" />
            <FaFacebook className="cursor-pointer text-blue-500 hover:scale-110 transition" />
            <FaYoutube className="cursor-pointer text-red-500 hover:scale-110 transition" />
            <FaTwitter className="cursor-pointer text-sky-400 hover:scale-110 transition" />
            <FaGoogle className="cursor-pointer text-orange-500 hover:scale-110 transition" />
            <FaSnapchat className="cursor-pointer text-yellow-400 hover:scale-110 transition" />
          </div>
        </div>
      </div>

      {/* ✅ Logout Confirmation Popup */}
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
    </>
  );
}
