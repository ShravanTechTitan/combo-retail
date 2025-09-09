import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import InputField from "../../components/dashboardComponents/InputField";
import ActionButtons from "../../components/dashboardComponents/ActionButtons";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog";
import api from "../../api/axiosConfig";

export default function PartCategoryPage() {
  const [Partcategories, setPartCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // ✅ Loading states
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPartCategories();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const fetchPartCategories = async () => {
    setLoadingData(true);
    try {
      const res = await api.get("/partCategories");
      setPartCategories(res.data);
    } catch (err) {
      console.error("Error fetching partCategories:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/partCategories/${editing._id}`, formData);
      } else {
        await api.post("/partCategories", formData);
      }
      fetchPartCategories();
      setFormData({ name: "", description: "" });
      setEditing(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving part category:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setFormData({ name: cat.name, description: cat.description });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/partCategories/${deleteId}`);
      fetchPartCategories();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting device category:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">Manage Device Part Categories</h2>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ name: "", description: "" });
            setShowForm(true);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm"
        >
          <FaPlus size={12} /> Add Category
        </button>
      </div>

      {/* Table */}
      {loadingData ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800  text-gray-700 dark:text-gray-200">
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Partcategories.map((c) => (
                <tr
                  key={c._id}
                  className="border-t border-gray-200   text-gray-700 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-3 py-2">{c.name}</td>
                  <td className="px-3 py-2">{c.description}</td>
                  <td className="px-3 py-2 text-center">
                    <ActionButtons
                      onEdit={() => handleEdit(c)}
                      onDelete={() => {
                        setDeleteId(c._id);
                        setConfirmOpen(true);
                      }}
                      disabled={deleting && deleteId === c._id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl w-full max-w-lg">
            <h3 className="text-lg font-bold mb-5 border-b border-gray-700 pb-2">
              {editing ? "Edit Device Part Category" : "Add New Device Part Category"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Battery, Display"
              />
              <InputField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description"
              />
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium flex items-center gap-2"
                  disabled={submitting}
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>
                  )}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Category"
        message="This action cannot be undone. Are you sure you want to delete this category?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
