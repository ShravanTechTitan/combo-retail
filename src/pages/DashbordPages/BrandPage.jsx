import React, { useState, useEffect } from "react";
import InputField from "../../components/dashboardComponents/InputField";
import FormModal from "../../components/dashboardComponents/FormModal";
import ActionButtons from "../../components/dashboardComponents/ActionButtons";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog";
import api from "../../api/axiosConfig";

export default function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [deviceCategories, setDeviceCategories] = useState([]);
  const [formdata, setFormdata] = useState({ name: "", country: "", category: "" });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch brands
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get("/brands");
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch device categories
  const fetchDeviceCategories = async () => {
    try {
      const res = await api.get("/deviceCategories");
      setDeviceCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchDeviceCategories();
  }, []);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formdata.name,
      country: formdata.country,
      deviceCategoryId: formdata.category,
    };
    try {
      if (editing) {
        await api.put(`/brands/${editing._id}`, payload);
      } else {
        await api.post("/brands", payload);
      }
      setFormdata({ name: "", country: "", category: "" });
      setEditing(null);
      setShowForm(false);
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  const handleEdit = (brand) => {
    setFormdata({ name: brand.name, country: brand.country, category: brand.deviceCategoryId?._id || "" });
    setEditing(brand);
    setShowForm(true);
  };

  const handleDeleteConfirm = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/brands/${deletingId}`);
      setBrands(brands.filter((b) => b._id !== deletingId));
      setConfirmOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  return (
    <div className="p-6 w-[100%] mx-auto bg-white rounded dark:bg-gray-900 text-black dark:text-white">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Brands</h1>
        <button
          onClick={() => {
            setFormdata({ name: "", country: "", category: "" });
            setEditing(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Add Brand
        </button>
      </div>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <table className="w-full  text-gray-700 dark:text-gray-200 text-left border border-gray-700 rounded-lg">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Country</th>
              <th className="p-2">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b._id} className="border-t  text-gray-700 dark:text-gray-200 border-gray-700">
                <td className="p-2">{b.name}</td>
                <td className="p-2">{b.country}</td>
                <td className="p-2">{b.deviceCategoryId?.name}</td>
                <td className="p-2">
                  <ActionButtons
                    onEdit={() => handleEdit(b)}
                    onDelete={() => handleDeleteConfirm(b._id)}
                    deleting={deletingId === b._id}
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
          title={editing ? "Edit Brand" : "Add Brand"}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        >
          <InputField label="Brand Name" name="name" value={formdata.name} onChange={handleChange} />

          <label className="block mb-2">Category</label>
          <select
            name="category"
            value={formdata.category}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 mb-4"
          >
            <option value="">Select Category</option>
            {deviceCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <InputField label="Country" name="country" value={formdata.country} onChange={handleChange} />
        </FormModal>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Brand"
        message="This action cannot be undone. Are you sure you want to delete this brand?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
