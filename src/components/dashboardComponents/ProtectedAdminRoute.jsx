import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

export default function ProtectedAdminRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role || localStorage.getItem("role");
        
        // Check if user is admin or superadmin
        if (userRole === "admin" || userRole === "superadmin") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You need admin privileges to access this page.",
          });
        }
      } catch (err) {
        console.error("Invalid token", err);
        setIsAuthorized(false);
        Swal.fire({
          icon: "error",
          title: "Invalid Session",
          text: "Please login again.",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

