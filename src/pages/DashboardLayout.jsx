import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/dashboardComponents/Sidebar";
import DashboardHeader from "../components/dashboardComponents/DashboardHeader";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar open={open} handleLogout={handleLogout} />
      <div className="flex flex-col flex-1">
        <DashboardHeader open={open} setOpen={setOpen} />
        <main className="p-4 md:p-6 flex-1 overflow-auto text-gray-800 dark:text-gray-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
