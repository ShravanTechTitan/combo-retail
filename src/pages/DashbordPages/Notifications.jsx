import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import SendNotificationModal from "../../components/dashboardComponents/SendNotificationModal";
import { formatDistanceToNow } from "date-fns";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Apply pagination
  useEffect(() => {
    setPagination((prev) => ({ ...prev, total: notifications.length }));
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    setFilteredNotifications(notifications.slice(start, end));
  }, [notifications, pagination.page, pagination.limit]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications/admin/history");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
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

  const getTypeColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Notification History
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
        >
          + Send Notification
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Sent By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        {notifications.length === 0 ? "No notifications sent yet." : "No notifications on this page."}
                      </td>
                    </tr>
                  ) : (
                    filteredNotifications.map((notif, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notif.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-300 max-w-md truncate">
                            {notif.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(notif.type)}`}>
                            {notif.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {notif.sentBy?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {notif.sentBy?.email || ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {notif.totalRecipients || 0} user(s)
                          </div>
                          {notif.recipients && notif.recipients.length > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notif.recipients.slice(0, 3).map((r, i) => (
                                <span key={i}>
                                  {r.name}
                                  {i < Math.min(2, notif.recipients.length - 1) && ", "}
                                </span>
                              ))}
                              {notif.recipients.length > 3 && ` +${notif.recipients.length - 3} more`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div>{new Date(notif.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} notifications
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
        </>
      )}

      {/* Send Notification Modal */}
      <SendNotificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          fetchNotifications();
        }}
      />
    </div>
  );
}

