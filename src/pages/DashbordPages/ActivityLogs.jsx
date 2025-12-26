import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function ActivityLogs() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ action: "", userId: "" });

  // Fetch all users for dropdown
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", pagination.page);
      params.append("limit", pagination.limit);
      if (filters.action) params.append("action", filters.action);
      if (filters.userId) params.append("userId", filters.userId);

      const res = await api.get(`/activity?${params.toString()}`);
      setActivities(res.data.activities || []);
      setPagination({
        ...pagination,
        total: res.data.total || 0,
        totalPages: res.data.totalPages || 0,
      });
    } catch (err) {
      console.error("Error fetching activities:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [filters, pagination.page]);

  const actionColors = {
    login: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    logout: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    register: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    subscribe: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    view_product: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    search: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    update_profile: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    change_password: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Activity Logs
      </h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Action
            </label>
            <select
              value={filters.action}
              onChange={(e) => {
                setFilters({ ...filters, action: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Actions</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="register">Register</option>
              <option value="subscribe">Subscribe</option>
              <option value="view_product">View Product</option>
              <option value="search">Search</option>
              <option value="update_profile">Update Profile</option>
              <option value="change_password">Change Password</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by User
            </label>
            <select
              value={filters.userId}
              onChange={(e) => {
                setFilters({ ...filters, userId: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ action: "", userId: "" });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
            >
              Clear Filters
            </button>
          </div>
          <div className="flex items-end">
            <div className="w-full text-sm text-gray-600 dark:text-gray-400">
              Total: {pagination.total} activities
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">User</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">Action</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">Details</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">IP Address</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr
                  key={activity._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-200">
                    {activity.user?.name || activity.user?.email || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        actionColors[activity.action] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {activity.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                    {activity.details || "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                    {activity.ipAddress || "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                    {new Date(activity.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {activities.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No activity logs found
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} activities
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
          
          {pagination.totalPages > 1 && (
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
                  max={pagination.totalPages}
                  value={pagination.page}
                  onChange={(e) => {
                    const pageNum = parseInt(e.target.value);
                    if (pageNum >= 1 && pageNum <= pagination.totalPages) {
                      setPagination({ ...pagination, page: pageNum });
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const pageNum = parseInt(e.target.value);
                      if (pageNum >= 1 && pageNum <= pagination.totalPages) {
                        setPagination({ ...pagination, page: pageNum });
                      } else {
                        alert(`Please enter a page number between 1 and ${pagination.totalPages}`);
                      }
                    }
                  }}
                  className="w-16 px-2 py-2 text-center border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  of {pagination.totalPages}
                </span>
              </div>
              
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

