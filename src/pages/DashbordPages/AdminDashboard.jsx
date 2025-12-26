import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosConfig";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog"; // adjust path if needed

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revenue, setRevenue] = useState({ totalRevenue: 0, totalPayments: 0, totalSubscriptions: 0 });
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [trialUsers, setTrialUsers] = useState({ trialUsersCount: 0, totalTrialSubscriptions: 0 });
  const [trialLoading, setTrialLoading] = useState(true);

  // Filters and Pagination
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    dateFilter: "", // "today", "week", "month", "all"
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // For confirmation modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const token = localStorage.getItem("token");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Get user role from token
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || localStorage.getItem("role") || "");
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, [token]);

  // Fetch all users (admin & superadmin)
  const fetchUsers = async () => {
    try {
      setError("");
      // Token is automatically added by axios interceptor
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return;
      }
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch users";
      setError(errorMsg);
      setUsers([]);
      setLoading(false);
    }
  };

  // Fetch total revenue
  const fetchRevenue = async () => {
    try {
      setRevenueLoading(true);
      // Token is automatically added by axios interceptor
      const res = await api.get("/admin/revenue");
      setRevenue(res.data || { totalRevenue: 0, totalPayments: 0, totalSubscriptions: 0 });
      setRevenueLoading(false);
    } catch (err) {
      console.error("Error fetching revenue:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return;
      }
      setRevenue({ totalRevenue: 0, totalPayments: 0, totalSubscriptions: 0 });
      setRevenueLoading(false);
    }
  };

  // Fetch trial users count
  const fetchTrialUsers = async () => {
    try {
      setTrialLoading(true);
      // Token is automatically added by axios interceptor
      const res = await api.get("/admin/trial-users");
      setTrialUsers(res.data || { trialUsersCount: 0, totalTrialSubscriptions: 0 });
      setTrialLoading(false);
    } catch (err) {
      console.error("Error fetching trial users:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return;
      }
      setTrialUsers({ trialUsersCount: 0, totalTrialSubscriptions: 0 });
      setTrialLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRevenue();
    fetchTrialUsers();
  }, []);

  // Apply filters and pagination
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower) ||
          u.number?.toString().includes(searchLower)
      );
    }

    // Apply role filter
    if (filters.role) {
      filtered = filtered.filter((u) => u.role === filters.role);
    }

    // Apply date filter
    if (filters.dateFilter && filters.dateFilter !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.dateFilter) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        default:
          cutoffDate = new Date(0); // All time
      }

      filtered = filtered.filter((u) => {
        const userDate = new Date(u.createdAt || u.updatedAt || 0);
        return userDate >= cutoffDate;
      });
    }

    // Update pagination total
    setPagination((prev) => ({ ...prev, total: filtered.length }));

    // Apply pagination
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    setFilteredUsers(filtered.slice(start, end));
  }, [users, filters, pagination.page, pagination.limit]);

  // Open confirmation modal
  const openConfirmDialog = (user, role) => {
    setSelectedUser(user);
    setNewRole(role);
    setDialogOpen(true);
  };

  // Confirm role change
  const handleConfirm = async () => {
    setDialogOpen(false);
    try {
      // Token is automatically added by axios interceptor
      const res = await api.put(
        `/admin/role/${selectedUser._id}`,
        { role: newRole }
      );

      setUsers(users.map((u) => (u._id === selectedUser._id ? res.data : u)));
      setSelectedUser(null);
      setNewRole("");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Loader
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${api.defaults.baseURL}/export/users`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              } catch (err) {
                console.error("Export error:", err);
              }
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition text-sm"
          >
            Export Users
          </button>
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${api.defaults.baseURL}/export/subscriptions`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              } catch (err) {
                console.error("Export error:", err);
              }
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition text-sm"
          >
            Export Subs
          </button>
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${api.defaults.baseURL}/export/revenue`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `revenue-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              } catch (err) {
                console.error("Export error:", err);
              }
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition text-sm"
          >
            Export Revenue
          </button>
          <button
            onClick={() => {
              fetchUsers();
              fetchRevenue();
              fetchTrialUsers();
            }}
            disabled={loading || revenueLoading || trialLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(loading || revenueLoading || trialLoading) ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{users.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Admins</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {users.filter(u => u.role === "admin" || u.role === "superadmin").length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Regular Users</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {users.filter(u => u.role === "user").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-6 rounded-lg shadow-md text-white">
            <h3 className="text-white text-sm font-medium opacity-90">Trial Users</h3>
            <p className="text-3xl font-bold mt-2">
              {trialLoading ? (
                <span className="text-2xl">...</span>
              ) : (
                trialUsers.trialUsersCount
              )}
            </p>
            <p className="text-sm mt-2 opacity-80">
              {trialUsers.totalTrialSubscriptions} trial subscriptions
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-lg shadow-md text-white">
            <h3 className="text-white text-sm font-medium opacity-90">Total Revenue</h3>
            <p className="text-3xl font-bold mt-2">
              {revenueLoading ? (
                <span className="text-2xl">...</span>
              ) : (
                `₹${revenue.totalRevenue.toLocaleString('en-IN')}`
              )}
            </p>
            <p className="text-sm mt-2 opacity-80">
              {revenue.totalPayments} payments (excl. trial)
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
          <p className="font-semibold">Error: {error}</p>
          <p className="text-sm mt-1">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or number..."
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => {
                setFilters({ ...filters, role: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">All Roles</option>
              <option value="user">Regular Users</option>
              <option value="admin">Admins</option>
              <option value="superadmin">Super Admins</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Date
            </label>
            <select
              value={filters.dateFilter}
              onChange={(e) => {
                setFilters({ ...filters, dateFilter: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ search: "", role: "", dateFilter: "" });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {!error && filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {users.length === 0 ? "No users found." : "No users match your filters."}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {filteredUsers.length > 0 && filteredUsers.map((u) => (
          <div
            key={u._id}
            className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
          >
            {/* User Info */}
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {u.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{u.email}</p>
              <p className="text-gray-600 dark:text-gray-400">
                Number: <span className="font-medium">{u.number}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Role: <span className="font-medium">{u.role}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Joined: <span className="font-medium">
                  {u.createdAt 
                    ? new Date(u.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'}
                </span>
              </p>
            </div>

            {/* Action Buttons - Only Superadmin can change roles */}
            {userRole === "superadmin" && (
              <div className="flex space-x-2 mt-4 md:mt-0">
                {u.role === "user" && (
                  <button
                    onClick={() => openConfirmDialog(u, "admin")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                  >
                    Promote to Admin
                  </button>
                )}
                {u.role === "admin" && (
                  <button
                    onClick={() => openConfirmDialog(u, "user")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                  >
                    Demote to User
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} users
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

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={dialogOpen}
        title="Change User Role"
        message={`Are you sure you want to change ${selectedUser?.name}'s role to ${newRole}?`}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
        confirmText="Yes, change"
        cancelText="Cancel"
        confirmColor="bg-green-600 hover:bg-green-700"
        cancelColor="bg-gray-600 hover:bg-gray-500"
      />
    </div>
  );
};

export default AdminDashboard;
