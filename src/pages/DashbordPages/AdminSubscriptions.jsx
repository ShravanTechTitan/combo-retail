import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { formatDistanceToNow } from "date-fns";

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(null); // track active operation
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user-subscriptions/");
      setSubscriptions(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Apply pagination
  useEffect(() => {
    setPagination((prev) => ({ ...prev, total: subscriptions.length }));
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    setFilteredSubscriptions(subscriptions.slice(start, end));
  }, [subscriptions, pagination.page, pagination.limit]);

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
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      {subscriptions.length === 0 ? "No subscriptions found." : "No subscriptions on this page."}
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((sub) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} subscriptions
              </div>
              
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => {
                    const newLimit = parseInt(e.target.value);
                    setPagination({ ...pagination, limit: newLimit, page: 1 });
                  }}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
              </div>
            </div>
            
            {pagination.total > pagination.limit && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                
                {/* Page Number Input */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Page</span>
                  <input
                    type="number"
                    min="1"
                    max={Math.ceil(pagination.total / pagination.limit)}
                    value={pagination.page}
                    onChange={(e) => {
                      const pageNum = parseInt(e.target.value);
                      if (pageNum >= 1 && pageNum <= Math.ceil(pagination.total / pagination.limit)) {
                        setPagination({ ...pagination, page: pageNum });
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const pageNum = parseInt(e.target.value);
                        const maxPage = Math.ceil(pagination.total / pagination.limit);
                        if (pageNum >= 1 && pageNum <= maxPage) {
                          setPagination({ ...pagination, page: pageNum });
                        } else {
                          alert(`Please enter a page number between 1 and ${maxPage}`);
                        }
                      }
                    }}
                    className="w-16 px-2 py-2 text-center border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    of {Math.ceil(pagination.total / pagination.limit)}
                  </span>
                </div>
                
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
