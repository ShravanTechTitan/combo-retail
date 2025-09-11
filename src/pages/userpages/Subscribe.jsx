import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../api/axiosConfig";

export default function Subscriptions() {
  const [plans, setPlans] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]); // ✅ array
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      const res = await api.get("/subscriptions");
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  // Fetch user subscriptions
  const fetchUserSubscription = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/user-subscriptions/user/${userId}`);
      setUserSubscriptions(res.data || []);
    } catch (err) {
      console.error("Error fetching user subscription:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPlans(), fetchUserSubscription()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const isLoggedIn = () => !!localStorage.getItem("token");

  // Subscribe flow
  const handleSubscribe = async (planId) => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    setSubscribing(planId);
    try {
      await api.post(`/user-subscriptions/${planId}/subscribe`, { userId });
      alert("✅ Subscription successful!");
      fetchUserSubscription();
    } catch (err) {
      console.error("Error subscribing:", err);
      alert("❌ Subscription failed. Try again.");
    } finally {
      setSubscribing(null);
    }
  };

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
      <Header />

      <div className="w-full py-12 flex flex-col items-center text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {userSubscriptions.length > 0
            ? "Your Subscriptions"
            : "Choose Your Subscription"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl">
          {userSubscriptions.length > 0
            ? "Manage your current subscriptions below."
            : "Pick the plan that fits your needs. Manage your devices and services efficiently."}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : userSubscriptions.length > 0 ? (
        // ✅ Show user subscriptions
        <div className="max-w-2xl mx-auto grid gap-6">
          {userSubscriptions.map((sub) => (
            <div
              key={sub._id}
              className={`p-6 rounded-xl shadow-lg text-center ${
                sub.status === "active"
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
            >
              <h2 className="text-xl font-bold">{sub.plan.name}</h2>
              <p>
                ₹{sub.plan.price} / {formatDuration(sub.plan.duration)}
              </p>
              <p>Status: {sub.status}</p>
              <p>Expiry: {new Date(sub.endDate).toLocaleDateString()}</p>

              {sub.status === "active" && (
                <div className="mt-4 flex gap-3 justify-center">
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg">
                    Cancel
                  </button>
                  <button
                    onClick={() => setUserSubscriptions([])} // 👈 show plans to upgrade
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg"
                  >
                    Upgrade
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // ✅ Show available plans if no subscription
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center"
            >
              <h2 className="text-2xl font-bold dark:text-white mb-2">
                {plan.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {plan.description}
              </p>
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
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg"
              >
                {subscribing === plan._id ? "Processing..." : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
