import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import InputField from "../../components/dashboardComponents/InputField";
import ActionButtons from "../../components/dashboardComponents/ActionButtons";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog";
import api from "../../api/axiosConfig";

export default function DeviceCategoryPage() {
  const [deviceCategories, setDeviceCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false); // loading for fetch
  const [deletingId, setDeletingId] = useState(null); // deleting spinner
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Load categories on mount
  useEffect(() => {
    fetchDeviceCategories();
  }, []);

  // Apply pagination
  useEffect(() => {
    setPagination((prev) => ({ ...prev, total: deviceCategories.length }));
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    setFilteredCategories(deviceCategories.slice(start, end));
  }, [deviceCategories, pagination.page, pagination.limit]);

  const fetchDeviceCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/deviceCategories"); 
      setDeviceCategories(res.data);
    } catch (err) {
      console.error("Error fetching deviceCategories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/deviceCategories/${editing._id}`, formData);
      } else {
        await api.post("/deviceCategories", formData);
      }
      fetchDeviceCategories();
      setFormData({ name: "", description: "" });
      setEditing(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setFormData({ name: cat.name, description: cat.description });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    setDeletingId(deleteId);
    try {
      await api.delete(`/deviceCategories/${deleteId}`);
      fetchDeviceCategories();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting device category:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">Manage Device Categories</h2>
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

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className=" text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800">
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                    {deviceCategories.length === 0 ? "No categories found." : "No categories on this page."}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((c) => (
                <tr
                  key={c._id}
                  className="border-t  text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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
                      deleting={deletingId === c._id}
                    />
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} categories
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

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl w-full max-w-lg">
            <h3 className="text-lg font-bold mb-5 border-b border-gray-700 pb-2">
              {editing ? "Edit Device Category" : "Add New Device Category"}
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Category"
        message="This action cannot be undone. Are you sure you want to delete this category?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
