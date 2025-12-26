import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import api from "../api/axiosConfig";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications?limit=10&unreadOnly=false");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (userId) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const userId = localStorage.getItem("id");
  if (!userId) return null;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          fetchNotifications();
        }}
        className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-[110] max-h-96 overflow-y-auto">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            {loading ? (
              <div className="p-4 text-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              <div>
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => {
                      if (!notif.read) markAsRead(notif._id);
                      if (notif.link) window.location.href = notif.link;
                    }}
                    className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      !notif.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {notif.title}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                          {notif.message}
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

