import { useState, useRef, useEffect } from "react";
import MultiSelect from "../../components/dashboardComponents/MultiSelect";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog";
import api from "../../api/axiosConfig";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const brandRef = useRef(null);
  const modelRef = useRef(null);

  // Filters and Pagination
  const [filters, setFilters] = useState({
    search: "",
    brandId: "",
    categoryId: "",
    modelId: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const initialForm = {
    id: "",
    brand: [],
    category: "",
    model: [],
    name: "",
    price: "",
    description: "",
    tags: [], // ✅ added
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

  const fetchProducts = async (page = 1, limit = 1000) => {
    try {
      // Fetch all products with a high limit, or use pagination
      const res = await api.get(`/products?page=${page}&limit=${limit}`);
      // Handle new response structure with pagination
      if (res.data.products && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
        // Update pagination state from backend response
        if (res.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: res.data.pagination.total,
            totalPages: res.data.pagination.totalPages,
          }));
        }
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  // Fetch all products by making multiple requests if needed
  const fetchAllProducts = async () => {
    try {
      setLoadingData(true);
      // First, get total count
      const firstPage = await api.get("/products?page=1&limit=1000");
      const total = firstPage.data.pagination?.total || firstPage.data.products?.length || 0;
      
      if (total <= 1000) {
        // All products fit in one request
        if (firstPage.data.products && Array.isArray(firstPage.data.products)) {
          setProducts(firstPage.data.products);
          setPagination(prev => ({
            ...prev,
            total: firstPage.data.pagination?.total || total,
            totalPages: firstPage.data.pagination?.totalPages || 1,
          }));
        }
      } else {
        // Need to fetch all pages
        let allProducts = [...(firstPage.data.products || [])];
        const totalPages = firstPage.data.pagination?.totalPages || Math.ceil(total / 1000);
        
        // Fetch remaining pages
        for (let page = 2; page <= totalPages; page++) {
          const res = await api.get(`/products?page=${page}&limit=1000`);
          if (res.data.products && Array.isArray(res.data.products)) {
            allProducts = [...allProducts, ...res.data.products];
          }
        }
        
        setProducts(allProducts);
        setPagination(prev => ({
          ...prev,
          total: total,
          totalPages: 1, // Since we loaded all, show as single page
        }));
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
      setProducts([]);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingData(true);
      await Promise.all([fetchBrands(), fetchModels(), fetchPartCategories()]);
      await fetchAllProducts(); // Fetch all products
      setLoadingData(false);
    };
    fetchAll();
  }, []);

  // Apply filters and pagination
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          p.brandIds?.some((b) => b.name?.toLowerCase().includes(searchLower)) ||
          p.modelIds?.some((m) => m.name?.toLowerCase().includes(searchLower))
      );
    }

    // Apply brand filter
    if (filters.brandId) {
      filtered = filtered.filter((p) =>
        p.brandIds?.some((b) => b._id === filters.brandId || b === filters.brandId)
      );
    }

    // Apply category filter
    if (filters.categoryId) {
      filtered = filtered.filter(
        (p) =>
          p.partCategoryId?._id === filters.categoryId || p.partCategoryId === filters.categoryId
      );
    }

    // Apply model filter
    if (filters.modelId) {
      filtered = filtered.filter((p) =>
        p.modelIds?.some((m) => m._id === filters.modelId || m === filters.modelId)
      );
    }

    // Update pagination total
    setPagination((prev) => ({ ...prev, total: filtered.length }));

    // Apply pagination
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    setFilteredProducts(filtered.slice(start, end));
  }, [products, filters, pagination.page, pagination.limit]);

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

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, tags: value.split(",").map((tag) => tag.trim()).filter(Boolean) });
  };

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
      tags: form.tags, // ✅ send tags
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        alert("Product updated successfully!");
      } else {
        const response = await api.post("/products", payload);
        // Show success message with count if multiple products were created
        if (response.data.count && response.data.count > 1) {
          alert(`Successfully created ${response.data.count} products (one for each model)!`);
        } else {
          alert("Product created successfully!");
        }
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await fetchAllProducts(); // Refresh all products
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p._id === id);
    
    // Extract base product name (remove model name if present)
    let baseName = product.name || "";
    if (product.modelIds && product.modelIds.length > 0) {
      // Remove the last model name from product name
      const modelName = product.modelIds[0].name;
      if (baseName.endsWith(` ${modelName}`)) {
        baseName = baseName.replace(` ${modelName}`, "").trim();
      }
    }
    
    setForm({
      id: product._id || "",
      brand: product.brandIds.map((b) => ({ label: b.name, value: b._id })),
      category: product.partCategoryId?._id || "",
      model: product.modelIds.map((m) => ({ label: m.name, value: m._id })),
      name: baseName, // Use base name without model
      price: product.price || "",
      description: product.description || "",
      tags: product.tags || [], // ✅ load tags
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
      // Remove from local state
      setProducts(products.filter((p) => p._id !== pendingDeleteId));
      // Also update filtered products
      setFilteredProducts(filteredProducts.filter((p) => p._id !== pendingDeleteId));
      // Update pagination total
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="p-6  text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">📚 Educational Content Manager</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg text-white transition-colors"
        >
          + Add Content
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Content
            </label>
            <input
              type="text"
              placeholder="Search by name, description, tags..."
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Brand
            </label>
            <select
              value={filters.brandId}
              onChange={(e) => {
                setFilters({ ...filters, brandId: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Category
            </label>
            <select
              value={filters.categoryId}
              onChange={(e) => {
                setFilters({ ...filters, categoryId: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">All Categories</option>
              {partCategory.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ search: "", brandId: "", categoryId: "", modelId: "" });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </div>
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
              <tr className="bg-gray-200  text-gray-700 dark:text-gray-200 dark:bg-gray-800">
                <th className="p-2 text-left text-sm">ID</th>
                <th className="p-2 text-left text-sm">Name</th>
                <th className="p-2 text-left text-sm">Brand</th>
                <th className="p-2 text-left text-sm">Category</th>
                <th className="p-2 text-left text-sm">Model</th>
                <th className="p-2 text-left text-sm">Price</th>
                <th className="p-2 text-left text-sm">Tags</th> {/* ✅ new */}
                <th className="p-2 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center p-4 text-gray-500 dark:text-white italic">
                    {products.length === 0 ? "No content added yet." : "No content matches your filters."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-300  text-gray-700 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-2 text-sm">{p._id}</td>
                    <td className="p-2 text-sm">{p.name}</td>
                    <td className="p-2 text-sm">{p.brandIds.map((b) => b.name).join(", ")}</td>
                    <td className="p-2 text-sm">{p.partCategoryId.name}</td>
                    <td className="p-2 text-sm">{p.modelIds.map((m) => m.name).join(", ")}</td>
                    <td className="p-2 text-sm">₹{p.price}</td>
                    <td className="p-2 text-sm">{p.tags?.join(", ")}</td> {/* ✅ show tags */}
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

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} items
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

              {/* Price + ID */}
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

              {/* Tags */}
             {/* Tags */}
<div>
  <label className="block mb-2">Tags</label>
  <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
    {form.tags.map((tag, index) => (
      <span
        key={index}
        className="px-2 py-1 bg-indigo-200 text-indigo-800 dark:text-white rounded-full text-xs flex items-center gap-1"
      >
        {tag}
        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              tags: prev.tags.filter((_, i) => i !== index),
            }))
          }
          className="ml-1 text-indigo-600 hover:text-red-500"
        >
          ✕
        </button>
      </span>
    ))}
    <input
      type="text"
      placeholder="Type & press comma"
      onKeyDown={(e) => {
        if (e.key === "," && e.target.value.trim() !== "") {
          e.preventDefault(); // ⛔ stop comma from typing
          const newTag = e.target.value.trim().replace(/,$/, ""); // remove trailing comma
          if (!form.tags.includes(newTag)) {
            setForm((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
          }
          e.target.value = "";
        }
      }}
      className="flex-grow bg-transparent outline-none p-1 text-sm"
    />
  </div>
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
                  onClick={() => {
                    setShowForm(false);
                    setForm(initialForm);
                  }}
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
                  Save Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Educational Content"
        message="This action cannot be undone. Are you sure you want to delete this content?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
