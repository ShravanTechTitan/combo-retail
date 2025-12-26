import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import Swal from "sweetalert2";

export default function SendNotification() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    userIds: [],
    title: "",
    message: "",
    type: "info",
    link: "",
    sendToAll: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Token is automatically added by axios interceptor
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return;
      }
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    if (formData.sendToAll) return; // Don't allow selection if "send to all" is checked
    
    setFormData((prev) => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter((id) => id !== userId)
        : [...prev.userIds, userId],
    }));
  };

  const handleSelectAll = () => {
    if (formData.sendToAll) return;
    
    if (formData.userIds.length === users.length) {
      setFormData((prev) => ({ ...prev, userIds: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        userIds: users.map((u) => u._id),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message) {
      Swal.fire("Error", "Please fill in title and message", "error");
      return;
    }

    if (!formData.sendToAll && formData.userIds.length === 0) {
      Swal.fire("Error", "Please select at least one user or choose 'Send to All'", "error");
      return;
    }

    try {
      setSending(true);
      
      if (formData.sendToAll) {
        const res = await api.post(
          "/notifications/admin/send-all",
          {
            title: formData.title,
            message: formData.message,
            type: formData.type,
            link: formData.link || null,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        
        Swal.fire("Success", `Notification sent to all ${res.data.count} users!`, "success");
      } else {
        const res = await api.post(
          "/notifications/admin/send",
          {
            userIds: formData.userIds,
            title: formData.title,
            message: formData.message,
            type: formData.type,
            link: formData.link || null,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        
        Swal.fire("Success", `Notification sent to ${res.data.count} user(s)!`, "success");
      }
      
      // Reset form
      setFormData({
        userIds: [],
        title: "",
        message: "",
        type: "info",
        link: "",
        sendToAll: false,
      });
    } catch (err) {
      console.error("Error sending notification:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to send notification", "error");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Send Notification
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Send to All Toggle */}
            <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <input
                type="checkbox"
                id="sendToAll"
                checked={formData.sendToAll}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    sendToAll: e.target.checked,
                    userIds: e.target.checked ? [] : prev.userIds,
                  }));
                }}
                className="w-5 h-5 text-yellow-600 rounded"
              />
              <label htmlFor="sendToAll" className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Send to All Users ({users.length} users)
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notification title"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Notification message"
                rows={4}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Link (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Link (Optional)
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com/page"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Send Notification"}
            </button>
          </form>
        </div>

        {/* User Selection Section */}
        {!formData.sendToAll && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Select Users ({formData.userIds.length} selected)
              </h2>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {formData.userIds.length === users.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user._id)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    formData.userIds.includes(user._id)
                      ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
                      : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.userIds.includes(user._id)}
                      onChange={() => handleUserSelect(user._id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

