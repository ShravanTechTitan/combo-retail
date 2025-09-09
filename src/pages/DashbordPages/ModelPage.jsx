import React, { useState, useRef, useEffect } from "react";
import InputField from "../../components/dashboardComponents/InputField";
import FormModal from "../../components/dashboardComponents/FormModal";
import ActionButtons from "../../components/dashboardComponents/ActionButtons";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog";
import api from "../../api/axiosConfig";

export default function ModelPage() {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: "", brand: "", series: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addingBrand, setAddingBrand] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchBrands = async () => {
    try {
      const res = await api.get("/brands");
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await api.get("/models");
      setModels(res.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      series: form.series,
      brandId: form.brand,
    };
    try {
      if (editingId) {
        await api.put(`/models/${editingId}`, payload);
      } else {
        await api.post("/models", payload);
      }
      setForm({ name: "", brand: "", series: "" });
      setShowForm(false);
      fetchModels();
    } catch (error) {
      console.error("Error saving models:", error);
    }
  };

  const handleEdit = (model) => {
    setForm({
      name: model.name,
      brand: model.brandId?._id || model.brandId,
      series: model.series,
    });
    setEditingId(model._id);
    setShowForm(true);
  };

  const handleDeleteConfirm = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/models/${deletingId}`);
      fetchModels();
      setConfirmOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting model:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 w-[90%] mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Models</h1>
        <button
          onClick={() => {
            setForm({ name: "", brand: "", series: "" });
            setEditingId(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg transition-colors duration-300"
        >
          Add Model
        </button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <table className="w-full text-left border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
            <tr>
              <th className="p-2">Model Name</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Series</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m._id} className="border-t border-gray-300  text-gray-700 dark:text-gray-200 dark:border-gray-700">
                <td className="p-2">{m.name}</td>
                <td className="p-2">{m.brandId?.name}</td>
                <td className="p-2">{m.series}</td>
                <td className="p-2">
                  <ActionButtons
                    onEdit={() => handleEdit(m)}
                    onDelete={() => handleDeleteConfirm(m._id)}
                    deleting={deletingId === m._id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Form Modal */}
      {showForm && (
        <FormModal
          title={editingId ? "Edit Model" : "Add Model"}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        >
          <InputField
            label="Model Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />

          {!addingBrand ? (
            <div className="mb-4">
              <label className="block mb-1">Brand</label>
              <select
                name="brand"
                value={form.brand}
                onChange={(e) => {
                  if (e.target.value === "__add__") {
                    setAddingBrand(true);
                  } else {
                    handleChange(e);
                  }
                }}
                className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <InputField
                label="Series"
                name="series"
                value={form.series}
                onChange={handleChange}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-2"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block mb-1">New Brand</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="Enter brand name"
                />
                <button
                  type="button"
                  onClick={() => {}}
                  className="px-3 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg transition-colors duration-300"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setAddingBrand(false)}
                  className="px-3 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </FormModal>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Model"
        message="This action cannot be undone. Are you sure you want to delete this model?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
