import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosConfig";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog"; // adjust path if needed

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revenue, setRevenue] = useState({ totalRevenue: 0, totalPayments: 0, totalSubscriptions: 0 });
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [trialUsers, setTrialUsers] = useState({ trialUsersCount: 0, totalTrialSubscriptions: 0 });
  const [trialLoading, setTrialLoading] = useState(true);

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
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
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
      const res = await api.get("/admin/revenue", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRevenue(res.data || { totalRevenue: 0, totalPayments: 0, totalSubscriptions: 0 });
      setRevenueLoading(false);
    } catch (err) {
      console.error("Error fetching revenue:", err);
      setRevenue({ totalRevenue: 0, totalPayments: 0, totalSubscriptions: 0 });
      setRevenueLoading(false);
    }
  };

  // Fetch trial users count
  const fetchTrialUsers = async () => {
    try {
      setTrialLoading(true);
      const res = await api.get("/admin/trial-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrialUsers(res.data || { trialUsersCount: 0, totalTrialSubscriptions: 0 });
      setTrialLoading(false);
    } catch (err) {
      console.error("Error fetching trial users:", err);
      setTrialUsers({ trialUsersCount: 0, totalTrialSubscriptions: 0 });
      setTrialLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRevenue();
    fetchTrialUsers();
  }, []);

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
      const res = await api.put(
        `/admin/role/${selectedUser._id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
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

      {!error && users.length === 0 && !loading && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No users found.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {users.length > 0 && users.map((u) => (
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
