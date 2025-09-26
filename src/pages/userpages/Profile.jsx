import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import Header from "../../components/Header";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  // ✅ Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
        setFormData(res.data);

        const subRes = await api.get(`/user-subscriptions/user/${localStorage.getItem("id")}`);
        console.log(subRes.data.activeSubscription
        )
        setSubscriptions(subRes.data.activeSubscription || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/users/profile", formData);
      console.log(res)
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className=" bg-white dark:bg-gray-900 max-w-md mx-auto my-8 px-4">
      <Header/>
      <div className="pt-10">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5">
        {/* Header */}
        <div className="mb-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
            {user?.name?.charAt(0) || "U"}
          </div>
          <h4 className="mt-3 text-xl font-semibold text-gray-800 dark:text-white">
            {user?.name}
          </h4>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        {/* Profile View/Edit */}
        {!editing ? (
          <div>
            <p className="mb-3">
              <span className="font-medium">Phone:</span> {user?.number}
            </p>
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="number"
                value={formData.number || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 text-white rounded-lg ${
                  saving
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
      <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Your Subscriptions
            </h3>
            {subscriptions.length === 0 ? (
              <p className="text-sm text-gray-500">No active subscriptions.</p>
            ) : (
              <ul className="space-y-2">
                {subscriptions.map((sub, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 bg-green-100 dark:bg-green-900 rounded-lg flex justify-between items-center"
                  >
                    <span className="font-medium">{sub.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {sub.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
    </div>
  );
}
