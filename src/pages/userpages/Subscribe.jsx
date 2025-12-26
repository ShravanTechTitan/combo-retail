import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";

export default function UserSubscriptions() {
  const [plans, setPlans] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(null);

  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  

  // Active subs
  const activeSubscriptions = userSubscriptions.filter(
    (sub) => new Date(sub.endDate) > new Date()
  );
  // Group subscriptions
  const expiredSubscriptions = Array.from(
    new Map(
      userSubscriptions
        .filter((sub) => new Date(sub.endDate) < new Date())
        .map((sub) => [sub.planId, sub]) // planId should be unique identifier
    ).values()
  );
  
  // Check if user has already used trial plan (any trial subscription in history)
  const hasUsedTrial = userSubscriptions.some(
    (sub) => sub.plan && sub.plan.duration === "trial24Hours"
  );

  // Avoid duplicates in available plans
  // Also exclude trial plan if user has already used it
  const availablePlans = plans.filter(
    (plan) => {
      // If user has used trial, exclude trial plan from available plans
      if (hasUsedTrial && (plan.duration === "trial24Hours" || plan.price === 0)) {
        return false;
      }
      return (
        !activeSubscriptions.some((sub) => sub.plan._id === plan._id) &&
        !expiredSubscriptions.some((sub) => sub.plan._id === plan._id)
      );
    }
  );


  // Check expiry + auto logout
  const checkExpiryAndLogout = (subs) => {
    const allExpired = subs.every(
      (sub) => new Date(sub.endDate) < new Date()
    );

    if (subs.length > 0 && allExpired) {
      Swal.fire("Session Ended", "Your subscription has expired. you need to re-subscribe to continue. our features are only available to subscribed users.", "info").then(
        () => {
          // localStorage.clear();
           
        }
      );
    }
  };

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
      const subs = res.data.subscriptions || [];
      setUserSubscriptions(subs);
      checkExpiryAndLogout(subs); // ✅ check on load
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
      sevenDays: "7 Days",
      trial24Hours: "24 Hours Trial",
      testing: "7 Days", // Legacy support
    };
    return map[duration] || duration;
  };

  // 📌 Days left
  const getExpiryDays = (endDate) =>
    Math.max(
      Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)),
      0
    );
    // 📌 Time left (days / hours / minutes / seconds)
const getExpiryTimeLeft = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end - now;

  if (diffMs <= 0) return "Expired";

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  if (diffDays > 0) return `${diffDays}d ${diffHours}h left`;
  if (diffHours > 0) return `${diffHours}h ${diffMinutes}m left`;
  if (diffMinutes > 0) return `${diffMinutes}m ${diffSeconds}s left`;

  return `${diffSeconds}s left`;
};


  // 📌 Time left (days / hours)
 useEffect(() => {
  const timer = setInterval(() => {
    setUserSubscriptions((subs) => [...subs]); // force re-render every second
  }, 1000);
  return () => clearInterval(timer);
}, []);

  // 📌 Subscribe / Upgrade
  const handleSubscribe = async (plan) => {
    if (!userId) {
      Swal.fire("Login Required", "Please login to subscribe!", "warning");
      return;
    }

    try {
      setSubscribing(plan._id);
      Swal.fire({ title: "Processing...", didOpen: () => Swal.showLoading() });

      // ✅ Check if it's a free trial plan (price = 0)
      if (plan.price === 0 || plan.duration === "trial24Hours") {
        try {
          const response = await api.post("/payments/activate-trial", {
            planId: plan._id,
            userId,
          });

          Swal.fire("Success", "Your free trial is now active!", "success");
          fetchPlans();
          fetchUserSubscriptions();
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Failed to activate trial";
          if (err.response?.data?.alreadyUsedTrial) {
            Swal.fire({
              icon: "warning",
              title: "Trial Already Used",
              text: errorMsg,
              confirmButtonText: "View Plans",
            });
          } else {
            Swal.fire("Error", errorMsg, "error");
          }
        } finally {
          setSubscribing(null);
        }
        return;
      }

      // For paid plans, use Razorpay
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
      if (err.response?.data?.isFreePlan) {
        // If backend says it's a free plan, try activating trial
        try {
          await api.post("/payments/activate-trial", {
            planId: plan._id,
            userId,
          });
          Swal.fire("Success", "Your free trial is now active!", "success");
          fetchPlans();
          fetchUserSubscriptions();
        } catch (trialErr) {
          Swal.fire("Error", trialErr.response?.data?.message || "Failed to activate trial", "error");
        }
      } else {
        Swal.fire("Error", err.response?.data?.message || "Something went wrong!", "error");
      }
    } finally {
      setSubscribing(null);
    }
  };

  // 📌 Cancel subscription
  // const handleCancel = async (subId) => {
  //   const confirm = await Swal.fire({
  //     title: "Cancel Subscription?",
  //     text: "You will lose all benefits immediately.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Cancel it",
  //   });
  //   if (!confirm.isConfirmed) return;

  //   try {
  //     await api.post(`/user-subscriptions/cancel/${subId}`);
  //     Swal.fire("Cancelled", "Your subscription has been cancelled.", "info");
  //     fetchUserSubscriptions();
  //   } catch (err) {
  //     Swal.fire("Error", "Failed to cancel subscription", "error");
  //   }
  // };

  return (

  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Header />

    {/* Title */}
    <div className="w-full py-12 flex flex-col mt-10 items-center text-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Subscription Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-xl">
        Manage, renew, or upgrade your plans here.
      </p>
    </div>

    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    ) : (
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* 🔹 Active Subscriptions */}
        {activeSubscriptions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
              Your Active Plans
            </h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSubscriptions.map((sub) => {
                const plan = sub.plan;
                const isRenew = getExpiryDays(sub.endDate) <= 7;
                return (
                  <div
                    key={sub._id}
                    className="rounded-2xl shadow-xl p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white relative"
                  >
                    <span className="absolute top-3 right-3 bg-yellow-300 text-black px-2 py-1 rounded-full text-xs font-bold">
                      {getExpiryTimeLeft(sub.endDate)}
                    </span>
                    <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                    <p className="mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-3xl font-extrabold">
                        ₹{plan.price}
                      </span>
                      <span className="ml-1 text-sm">/ {formatDuration(plan.duration)}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {isRenew && (
                        <button
                          onClick={() => handleSubscribe(plan)}
                          disabled={subscribing === plan._id}
                          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
                        >
                          {subscribing === plan._id ? "Processing..." : "Renew Now"}
                        </button>
                      )}
                      {/* <button
                        onClick={() => handleCancel(sub._id)}
                        className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-semibold"
                      >
                        Cancel
                      </button> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 🔹 Expired Subscriptions */}
        {expiredSubscriptions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
              Expired Plans
            </h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredSubscriptions.map((sub) => (
                <div
                  key={sub._id}
                  className="rounded-2xl shadow p-6 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 relative"
                >
                  <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Expired
                  </span>
                  <h2 className="text-xl font-bold mb-2">{sub.plan.name}</h2>
                  <p className="mb-4">{sub.plan.description}</p>
                  <button
                    onClick={() => handleSubscribe(sub.plan)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
                  >
                    Re-Subscribe
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔹 Available Plans */}
        {availablePlans.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
              Available Plans
            </h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePlans.map((plan) => (
                <div
                  key={plan._id}
                  className="rounded-2xl shadow-xl p-6 bg-white dark:bg-gray-800 text-center"
                >
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-green-600">
                      ₹{plan.price}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">
                      / {formatDuration(plan.duration)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={subscribing === plan._id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
                    >
                      {subscribing === plan._id ? "Processing..." : "Subscribe"}
                    </button>
                    {plan.price > 0 && (
                      <a
                        href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}/api/invoice/${plan._id}/0`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm"
                        title="View Invoice"
                      >
                        📄
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
  );
}
