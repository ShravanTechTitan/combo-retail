// src/pages/Subscriptions/UserSubscriptions.jsx
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import api from "../../api/axiosConfig";

export default function UserSubscriptions() {
  const [plans, setPlans] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(null);

  const userId = localStorage.getItem("id");
  console.log("User ID:", userId);
  console.log("Razorpay Key:", import.meta.env.VITE_APP_RAZORPAY_KEY_ID);

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
      console.error("Error fetching user subscriptions:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPlans(), fetchUserSubscription()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // Format plan duration
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

  // Subscribe to a plan
  const handleSubscribe = async (plan) => {
    if (!userId) {
      alert("Please login to subscribe!");
      return;
    }

    try {
      setSubscribing(plan._id);

      console.log("Creating order for planId:", plan._id);

      // ✅ Step 1: Create order in backend
      const { data } = await api.post("/payments/create-order", {
        planId: plan._id,
      });

      console.log("Order created:", data);

      // ✅ Step 2: Razorpay options
      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Universal Combo",
        description: plan.name,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment & activate subscription
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan._id,
              userId,
            });

            alert("Payment Successful!");
            fetchPlans();
            fetchUserSubscription();
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed");
          }
        },
        theme: { color: "#3399cc" },
      };

      // Step 4: Open Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Something went wrong! Check console.");
    } finally {
      setSubscribing(null);
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
            </div>
          ))}
        </div>
      ) : (
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
                onClick={() => handleSubscribe(plan)}
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
