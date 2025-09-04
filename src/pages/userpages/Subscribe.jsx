import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ navigation
import Header from "../../components/Header";
import api from "../../api/axiosConfig";

export default function Subscriptions() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(null); // track which plan is being subscribed
  const navigate = useNavigate();

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subscriptions"); 
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Check if user is logged in (simple example using localStorage token)
  const isLoggedIn = () => {
    return !!localStorage.getItem("token"); // change if you store auth differently
  };

  // Subscribe flow
  const handleSubscribe = async (planId) => {
  if (!isLoggedIn()) {
    navigate("/login");
    return;
  }
  console.log(localStorage.getItem("id"))
  setSubscribing(planId);
  try {
    const userId = localStorage.getItem("id"); // ✅ store this on login
    await api.post(`/user-subscriptions/${planId}/subscribe`, { userId });
    alert("✅ Subscription successful!");
  } catch (err) {
    console.error("Error subscribing:", err);
    alert("❌ Subscription failed. Try again.");
  } finally {
    setSubscribing(null);
  }
};


  // Helper to format duration
  const formatDuration = (duration) => {
    switch (duration) {
      case "perMonth":
        return "1 Month";
      case "sixMonths":
        return "6 Months";
      case "perYear":
        return "1 Year";
      case "eighteenMonths":
        return "18 Months";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Hero / Title */}
      <div className="w-full py-12 flex flex-col items-center text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Subscription
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl">
          Pick the plan that fits your needs. Manage your devices and services efficiently.
        </p>
      </div>

      {/* Subscriptions Grid / Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col items-center text-center"
            >
              <h2 className="text-2xl font-bold dark:text-white mb-2">{plan.name}</h2>

              {plan.description && (
                <p className="text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>
              )}

              <div className="mb-4 flex items-center gap-2">
                <span className="text-3xl font-extrabold text-green-600 dark:text-blue-400">
                  ₹{plan.price}
                </span>
                <span className="text-gray-500 dark:text-gray-300 text-sm">
                  / {formatDuration(plan.duration)}
                </span>
              </div>

              <button
                onClick={() => handleSubscribe(plan._id)}
                disabled={subscribing === plan._id}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition transform hover:-translate-y-1 flex items-center gap-2"
              >
                {subscribing === plan._id ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
