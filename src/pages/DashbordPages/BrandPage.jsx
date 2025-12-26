import React, { useState, useEffect } from "react";
import InputField from "../../components/dashboardComponents/InputField";
import FormModal from "../../components/dashboardComponents/FormModal";
import ActionButtons from "../../components/dashboardComponents/ActionButtons";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog";
import api from "../../api/axiosConfig";

export default function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [deviceCategories, setDeviceCategories] = useState([]);
  const [formdata, setFormdata] = useState({ name: "", country: "", category: "" });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

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

  // Apply pagination
  useEffect(() => {
    setPagination((prev) => ({ ...prev, total: brands.length }));
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    setFilteredBrands(brands.slice(start, end));
  }, [brands, pagination.page, pagination.limit]);

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
            {filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {brands.length === 0 ? "No brands found." : "No brands on this page."}
                </td>
              </tr>
            ) : (
              filteredBrands.map((b) => (
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
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} brands
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
