import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append("startDate", dateRange.startDate);
      if (dateRange.endDate) params.append("endDate", dateRange.endDate);

      const res = await api.get(`/admin/analytics?${params.toString()}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
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
    fetchAnalytics();
  }, [dateRange]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!analytics) return <div>No analytics data available</div>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Analytics Dashboard</h1>
        <div className="flex gap-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="px-3 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="px-3 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Conversion Rate
          </h3>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            {analytics.conversionRate}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {analytics.totalTrialUsers} trial users → {analytics.totalPaidUsers} paid users
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Total Trial Users
          </h3>
          <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
            {analytics.totalTrialUsers}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Revenue (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            User Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.userGrowthByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#00C49F" name="New Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Plan Popularity
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.planStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ plan, percent }) => `${plan}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {analytics.planStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

