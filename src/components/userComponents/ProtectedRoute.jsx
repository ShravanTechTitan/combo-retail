// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";

export default function ProtectedRoute({ user, children }) {
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("id");
  const location = useLocation();

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/user-subscriptions/user/${userId}`);
        const subs = res.data.subscriptions || [];

        // ✅ keep only active subs
        const active = subs.filter(
          (sub) => new Date(sub.endDate) > new Date()
        );

        setActiveSubscriptions(active);
      } catch (err) {
        console.error("Error fetching user subscriptions:", err);
        Swal.fire("Error", "Failed to fetch your subscriptions", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubscriptions();
  }, [userId]);

  // 🔄 Show nothing until API finishes
  if (loading) return null;

  // 1️⃣ If not logged in → go login
  if (!userId) {
    return <Navigate to="/login"  state={{ from: location }} replace  />;
  }

  // 2️⃣ If no active subscription → go subscribe
  if (activeSubscriptions.length === 0) {
    return <Navigate to="/subscribe" replace />;
  }

  // ✅ If logged in + active sub
  return children;
}
