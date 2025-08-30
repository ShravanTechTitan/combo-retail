import { useState, useRef, useEffect } from "react";
import MultiSelect from "../../components/dashboardComponents/MultiSelect";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog";
import api from "../../api/axiosConfig";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const brandRef = useRef(null);
  const modelRef = useRef(null);

  const initialForm = {
    id: "",
    brand: [],
    category: "",
    model: [],
    name: "",
    price: "",
    description: "",
  };

  const [form, setForm] = useState(initialForm);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [partCategory, setPartCategory] = useState([]);

  // Dropdown open states
  const [openBrandDropdown, setOpenBrandDropdown] = useState(false);
  const [openModelDropdown, setOpenModelDropdown] = useState(false);

  // Loading states
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Track which product is pending delete
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Fetch functions
  const fetchBrands = async () => {
    try {
      const res = await api.get("/brands");
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchModels = async () => {
    try {
      const res = await api.get("/models");
      setModels(res.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const fetchPartCategories = async () => {
    try {
      const res = await api.get("/partCategories");
      setPartCategory(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingData(true);
      await Promise.all([fetchBrands(), fetchModels(), fetchPartCategories(), fetchProducts()]);
      setLoadingData(false);
    };
    fetchAll();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandRef.current && !brandRef.current.contains(event.target)) {
        setOpenBrandDropdown(false);
      }
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        setOpenModelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: form.name,
      partCategoryId: form.category || "",
      modelIds: form.model.map((m) => m.value) || [],
      brandIds: form.brand.map((b) => b.value) || [],
      price: Number(form.price),
      description: form.description,
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p._id === id);
    setForm({
      id: product._id || "",
      brand: product.brandIds.map((b) => ({ label: b.name, value: b._id })),
      category: product.partCategoryId?._id || "",
      model: product.modelIds.map((m) => ({ label: m.name, value: m._id })),
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDeleteConfirm = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    setDeletingId(pendingDeleteId);
    try {
      await api.delete(`/products/${pendingDeleteId}`);
      setProducts(products.filter((p) => p._id !== pendingDeleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">📦 Product Manager</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg text-white transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      {loadingData ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="p-2 text-left text-sm">ID</th>
                <th className="p-2 text-left text-sm">Name</th>
                <th className="p-2 text-left text-sm">Brand</th>
                <th className="p-2 text-left text-sm">Category</th>
                <th className="p-2 text-left text-sm">Model</th>
                <th className="p-2 text-left text-sm">Price</th>
                <th className="p-2 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center p-4 text-gray-500 dark:text-gray-400 italic">
                    No products added yet.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-2 text-sm">{p._id}</td>
                    <td className="p-2 text-sm">{p.name}</td>
                    <td className="p-2 text-sm">{p.brandIds.map((b) => b.name).join(", ")}</td>
                    <td className="p-2 text-sm">{p.partCategoryId.name}</td>
                    <td className="p-2 text-sm">{p.modelIds.map((m) => m.name).join(", ")}</td>
                    <td className="p-2 text-sm">₹{p.price}</td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(p._id)}
                        className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded transition-colors"
                        disabled={deletingId === p._id}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(p._id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded flex items-center justify-center"
                        disabled={deletingId === p._id}
                      >
                        {deletingId === p._id ? (
                          <div className="w-4 h-4 border-2 border-green-500 border-dashed rounded-full animate-spin"></div>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto p-8 transition-colors">
            <h3 className="text-xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">
              {editingId ? "Edit Product" : "Add Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name + Category */}
              <div className="flex gap-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-1/2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  required
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-1/2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  required
                >
                  <option value="">Select Category</option>
                  {partCategory.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand MultiSelect */}
              <div ref={brandRef} className="relative">
                <MultiSelect
                  label="Brand"
                  options={brands.map((b) => ({ label: b.name, value: b._id }))}
                  selected={form.brand}
                  onChange={(val) => setForm((prev) => ({ ...prev, brand: val }))}
                  placeholder="Select Brand"
                />
              </div>

              {/* Model MultiSelect */}
              <div ref={modelRef} className="relative">
                <MultiSelect
                  label="Model"
                  options={models.map((m) => ({ label: m.name, value: m._id }))}
                  selected={form.model}
                  onChange={(val) => setForm((prev) => ({ ...prev, model: val }))}
                  placeholder="Select Model"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  placeholder="Part Code"
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Product description"
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 sticky bottom-0 bg-white dark:bg-gray-900 py-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>
                  )}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Product"
        message="This action cannot be undone. Are you sure you want to delete this product?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
