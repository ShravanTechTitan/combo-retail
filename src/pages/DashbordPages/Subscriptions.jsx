import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog";

export default function AdminSubscriptions() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    duration: "perMonth",
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Format duration for display
  const formatDuration = (duration) => {
    const map = {
      trial24Hours: "24 Hours Trial",
      sevenDays: "7 Days",
      perMonth: "1 Month",
      sixMonths: "6 Months",
      perYear: "1 Year",
      eighteenMonths: "18 Months",
      testing: "7 Days", // Legacy support
    };
    return map[duration] || duration;
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      // Fetch all subscriptions including inactive ones for admin
      const res = await api.get("/subscriptions?admin=true");
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPlan((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddOrUpdatePlan = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPlanId) {
        const res = await api.put(`/subscriptions/${editingPlanId}`, newPlan);
        setPlans((prev) =>
          prev.map((plan) => (plan._id === editingPlanId ? res.data : plan))
        );
      } else {
        const res = await api.post("/subscriptions", newPlan);
        setPlans((prev) => [...prev, res.data]);
      }
      setShowModal(false);
      setNewPlan({ name: "", price: "", duration: "perMonth", active: true });
      setEditingPlanId(null);
    } catch (err) {
      console.error("Error saving plan:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlanId(plan._id);
    setNewPlan({
      name: plan.name,
      price: plan.price,
      duration: plan.duration || "perMonth",
      active: plan.active,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/subscriptions/${deleteId}`);
      setPlans((prev) => prev.filter((plan) => plan._id !== deleteId));
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting plan:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          📝 Manage Subscriptions
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Add New Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th className="py-3 px-4 text-left">Plan Name</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan._id}
                  className="border-b dark:border-gray-700  text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="py-3 px-4">{plan.name}</td>
                  <td className="py-3 px-4">
                    ₹{plan.price} ({formatDuration(plan.duration)})
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        plan.active
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {plan.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No subscription plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              setEditingPlanId(null);
            }}
          />
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl z-10 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingPlanId ? "Edit Plan" : "Add New Plan"}
            </h3>
            <form onSubmit={handleAddOrUpdatePlan} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newPlan.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={newPlan.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1">
                  Duration
                </label>
                <select
                  name="duration"
                  value={newPlan.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
                >
                  <option value="trial24Hours">24 Hours Trial</option>
                  <option value="sevenDays">7 Days Plan</option>
                  <option value="perMonth">Per Month</option>
                  <option value="sixMonths">6 Months</option>
                  <option value="perYear">Per Year</option>
                  <option value="eighteenMonths">18 Months</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={newPlan.active}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label className="text-gray-700 dark:text-gray-200">Active</label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPlanId(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  {saving ? "Saving..." : editingPlanId ? "Update Plan" : "Add Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Plan"
        message="This action cannot be undone. Are you sure you want to delete this subscription plan?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
