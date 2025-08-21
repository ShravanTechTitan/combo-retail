import { FaBars } from "react-icons/fa";

export default function DashboardHeader({ open, setOpen }) {
  return (
    <header className="flex justify-between items-center px-2 py-5 sticky top-0 z-10 shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-600 dark:text-gray-300 text-lg z-20"
        >
          <FaBars />
        </button>
        <h1 className="font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:block">
          {localStorage.getItem("email") || "Admin"}
        </span>
      </div>
    </header>
  );
}
