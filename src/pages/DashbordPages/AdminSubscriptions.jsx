import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { formatDistanceToNow } from "date-fns";

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(null); // track active operation

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user-subscriptions/");
      setSubscriptions(res.data);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // ✅ Delete subscription
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription?")) return;
    setProcessing(id);
    try {
      await api.delete(`/user-subscriptions/${id}`);
      setSubscriptions(subscriptions.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting subscription:", err);
      alert("❌ Failed to delete subscription");
    } finally {
      setProcessing(null);
    }
  };

  // 🚫 Mark as inactive
const handleToggle = async (subId) => {
  try {
    await api.put(`/user-subscriptions/${subId}/toggle-status`);
    // Refresh the list after toggling
    fetchSubscriptions();
  } catch (err) {
    console.error("Error toggling status:", err);
    alert("Failed to update status");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          All User Subscriptions
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Plan</th>
                  <th className="py-3 px-4 text-left">Start Date</th>
                  <th className="py-3 px-4 text-left">End Date</th>
                  <th className="py-3 px-4 text-left">Time Left</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr
                    key={sub._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3 px-4">{sub.user?.name}</td>
                    <td className="py-3 px-4">{sub.user?.email}</td>
                    <td className="py-3 px-4">{sub.plan?.name}</td>
                    <td className="py-3 px-4">{new Date(sub.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{new Date(sub.endDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-semibold">
                      {formatDistanceToNow(new Date(sub.endDate), { addSuffix: true })}
                    </td>
                    <td
                      className={`py-3 px-4 font-bold ${
                        sub.status === "active"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {sub.status}
                    </td>
                    <td className="py-3 px-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleToggle(sub._id)}
                        disabled={processing === sub._id}
                        className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                      >
                        {processing === sub._id ? "..." : "Inactive"}
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        disabled={processing === sub._id}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        {processing === sub._id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}

                {subscriptions.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No subscriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
