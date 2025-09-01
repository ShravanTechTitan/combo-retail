import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog"; // adjust path if needed

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // For confirmation modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all users (superadmin only)
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      const res = await axios.put(
        `/api/admin/role/${selectedUser._id}`,
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 dark:text-gray-300">Loading...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Admin Dashboard
      </h1>

      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
          >
            {/* User Info */}
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-gray-800 dark:text-gray-200">{u.name}</p>
              <p className="text-gray-600 dark:text-gray-400">{u.email}</p>
              <p className="text-gray-600 dark:text-gray-400">
                Role: <span className="font-medium">{u.role}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Subscription:{" "}
                {u.subscriptionActive
                  ? `Active until ${new Date(u.subscriptionExpiry).toLocaleDateString()}`
                  : "Inactive"}
              </p>
            </div>

            {/* Action Buttons */}
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
