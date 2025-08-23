import { useState } from "react";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const initialForm = {
    id: "",
    brand: "",
    vendor: "",
    category: "",
    model: "",
    partCode: "",
    name: "",
    price: "",
    stock: "",
    description: "",
    warranty: "",
  };

  const [form, setForm] = useState(initialForm);

  const brands = ["Samsung", "Realme", "Oppo"];
  const vendors = ["Vendor A", "Vendor B", "Vendor C"];
  const categories = ["Battery", "Display", "Camera"];
  const models = ["F14", "F15", "S20", "Note 10"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setProducts(products.map((p) => (p.id === editing ? form : p)));
    } else {
      setProducts([...products, { ...form }]);
    }
    setForm(initialForm);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    setForm(product);
    setEditing(id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          📦 Product Manager
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg text-white transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="p-2 text-left text-sm">ID</th>
              <th className="p-2 text-left text-sm">Brand</th>
              <th className="p-2 text-left text-sm">Vendor</th>
              <th className="p-2 text-left text-sm">Category</th>
              <th className="p-2 text-left text-sm">Model</th>
              <th className="p-2 text-left text-sm">Name</th>
              <th className="p-2 text-left text-sm">Price</th>
              <th className="p-2 text-left text-sm">Stock</th>
              <th className="p-2 text-left text-sm">Warranty</th>
              <th className="p-2 text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="p-2 text-sm">{p.id}</td>
                <td className="p-2 text-sm">{p.brand}</td>
                <td className="p-2 text-sm">{p.vendor}</td>
                <td className="p-2 text-sm">{p.category}</td>
                <td className="p-2 text-sm">{p.model}</td>
                <td className="p-2 text-sm">{p.name}</td>
                <td className="p-2 text-sm">₹{p.price}</td>
                <td className="p-2 text-sm">{p.stock}</td>
                <td className="p-2 text-sm">{p.warranty}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(p.id)}
                    className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="text-center p-4 text-gray-500 dark:text-gray-400 italic"
                >
                  No products added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form with Scroll */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto p-8 transition-colors">
            <h3 className="text-xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">
              {editing ? "✏️ Edit Product" : "➕ Add Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Brand + Vendor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Brand</label>
                  <select
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b, i) => (
                      <option key={i} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Vendor</label>
                  <select
                    name="vendor"
                    value={form.vendor}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((v, i) => (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category + Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Model</label>
                  <select
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  >
                    <option value="">Select Model</option>
                    {models.map((m, i) => (
                      <option key={i} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Part Code + Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Part Code</label>
                  <input
                    type="text"
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                    placeholder="e.g. B345"
                  />
                </div>
                <div>
                  <label className="block mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                    placeholder="Samsung Battery B345"
                  />
                </div>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                    placeholder="Enter Price"
                  />
                </div>
                <div>
                  <label className="block mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                    placeholder="Enter Stock Count"
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
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  placeholder="Enter product details..."
                />
              </div>

              {/* Warranty */}
              <div>
                <label className="block mb-2">Warranty</label>
                <input
                  type="text"
                  name="warranty"
                  value={form.warranty}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  placeholder="e.g. 6 Months"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 sticky bottom-0 bg-white dark:bg-gray-900 py-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
