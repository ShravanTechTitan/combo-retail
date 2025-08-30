import { Link, useLocation } from "react-router-dom";
import { FaBox, FaMobileAlt, FaFileAlt } from "react-icons/fa";

export default function Sidebar({ open, handleLogout }) {
  const location = useLocation();

  const menuItems = [
   
    { name: "Mobiles", path: "/dashboard/mobiles", icon: <FaMobileAlt /> },
    { name: "Subscriptions", path: "/dashboard/subscriptions", icon: <FaFileAlt /> },
    { name: "Device Categories", path: "/dashboard/deviceCategories", icon: <FaFileAlt /> },
    { name: "Part Categories", path: "/dashboard/PartCategories", icon: <FaFileAlt /> },
    { name: "Products", path: "/dashboard/Products", icon: <FaFileAlt /> },
    { name: "Model", path: "/dashboard/ModelPage", icon: <FaFileAlt /> },
    { name: "Brand", path: "/dashboard/BrandPage", icon: <FaFileAlt /> },
];

  return (
    <div
      className={`flex flex-col text-sm justify-between transition-all duration-300 shadow-md ${
        open ? "w-64" : "w-20"
      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200`}
    >
      {/* Top Menu */}
      <div>
        <div className="p-4 font-bold text-lg flex items-center justify-between">
          {open && <span className="text-indigo-500">Combo Retail</span>}
        </div>

        <nav className="mt-6 flex-1">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="mx-2 my-1">
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 p-3 rounded-lg transition cursor-pointer ${
                    location.pathname.includes(item.path)
                      ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {open && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Controls: Logout */}
      {open && (
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
