// src/pages/Subscriptions/UserSubscriptions.jsx
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";

export default function UserSubscriptions() {
  const [plans, setPlans] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(null);

  const userId = localStorage.getItem("id");

  // ✅ Multiple active subs
  const activeSubscriptions = userSubscriptions.filter(
    (sub) => sub.status === "active"
  );

  // 📌 Fetch all plans
  const fetchPlans = async () => {
    try {
      const res = await api.get("/subscriptions");
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
      Swal.fire("Error", "Failed to fetch plans", "error");
    }
  };

  // 📌 Fetch user subscriptions
  const fetchUserSubscriptions = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/user-subscriptions/user/${userId}`);
      setUserSubscriptions(res.data.subscriptions || []);
    } catch (err) {
      console.error("Error fetching user subscriptions:", err);
      Swal.fire("Error", "Failed to fetch your subscriptions", "error");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPlans(), fetchUserSubscriptions()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // 📌 Format plan duration
  const formatDuration = (duration) => {
    const map = {
      perMonth: "1 Month",
      sixMonths: "6 Months",
      perYear: "1 Year",
      eighteenMonths: "18 Months",
    };
    return map[duration] || duration;
  };

  // 📌 Days left for expiry
const getExpiryDays = (endDate) =>
  Math.max(
    Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)),
    0
  );
    // 📌 Time left for expiry (days / hours)
const getExpiryTimeLeft = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end - now;

  if (diffMs <= 0) return "Expired";

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
  return `${diffHours} hour${diffHours > 1 ? "s" : ""} left`;
};


  // 📌 Subscribe / Upgrade
  const handleSubscribe = async (plan) => {
    if (!userId) {
      Swal.fire("Login Required", "Please login to subscribe!", "warning");
      return;
    }

    try {
      setSubscribing(plan._id);
      Swal.fire({ title: "Processing...", didOpen: () => Swal.showLoading() });

      const { data } = await api.post("/payments/create-order", {
        planId: plan._id,
      });

      Swal.close();

      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Universal Combo",
        description: plan.name,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            Swal.fire({
              title: "Verifying payment...",
              didOpen: () => Swal.showLoading(),
              allowOutsideClick: false,
            });

            await api.post("/payments/verify", {
              ...response,
              planId: plan._id,
              userId,
            });

            Swal.fire("Success", "Your subscription is now active.", "success");
            fetchPlans();
            fetchUserSubscriptions();
          } catch (err) {
            Swal.fire("Error", "Payment verification failed!", "error");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Subscription error:", err);
      Swal.fire("Error", "Something went wrong! Check console.", "error");
    } finally {
      setSubscribing(null);
    }
  };

  // 📌 Cancel subscription
  const handleCancel = async (subId) => {
    const confirm = await Swal.fire({
      title: "Cancel Subscription?",
      text: "You will lose all benefits immediately.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.post(`/user-subscriptions/cancel/${subId}`);
      Swal.fire("Cancelled", "Your subscription has been cancelled.", "info");
      fetchUserSubscriptions();
    } catch (err) {
      Swal.fire("Error", "Failed to cancel subscription", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      {/* Title */}
      <div className="w-full py-12 flex flex-col items-center text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {activeSubscriptions.length > 0
            ? "Manage Your Subscriptions"
            : "Choose a Plan"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl">
          {activeSubscriptions.length > 0
            ? "Upgrade, renew or cancel your current subscriptions."
            : "Pick the plan that best suits your needs."}
        </p>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const activeSub = activeSubscriptions.find(
              (sub) => sub.plan._id === plan._id
            );
            const isActive = !!activeSub;
           const isRenew =
                  isActive && getExpiryDays(activeSub.endDate) <= 7;


            const isHigherPlan =
              activeSubscriptions.length > 0 &&
              plan.price >
                Math.max(...activeSubscriptions.map((s) => s.plan.price));

            return (
              <div
                key={plan._id}
                className={`rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 relative ${
                  isActive
                    ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                {/* Active Badge */}
                {isActive && (
                  <span className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold">
                    Active
                  </span>
                )}

                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-gray-500 dark:text-gray-300 mb-4">
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

                {/* Buttons */}
                <div className="w-full flex flex-col gap-3">
                  {isActive ? (
                    <>
                      {isRenew && (
                        <button
                          onClick={() => handleSubscribe(plan)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow"
                        >
                          Renew Now ({getExpiryTimeLeft(activeSub.endDate)} )
                        </button>
                      )}
                      <button
                        onClick={() => handleCancel(activeSub._id)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow"
                      >
                        Cancel
                      </button>
                    </>
                  ) : activeSubscriptions.length > 0 ? (
                    isHigherPlan && (
                      <button
                        onClick={() => handleSubscribe(plan)}
                        disabled={subscribing === plan._id}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
                      >
                        {subscribing === plan._id ? "Processing..." : "Upgrade"}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={subscribing === plan._id}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
                    >
                      {subscribing === plan._id ? "Processing..." : "Subscribe"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
