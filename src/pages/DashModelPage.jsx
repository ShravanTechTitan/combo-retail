// pages/ModelPage.jsx
import React, { useState } from "react";
import InputField from "../components/dashboardComponents/InputField";
import FormModal from "../components/dashboardComponents/FormModal";
import ActionButtons from "../components/dashboardComponents/ActionButtons";

export default function ModelPage() {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState(["Samsung", "Apple", "Realme"]); // default brands
  const [form, setForm] = useState({ name: "", brand: "", series: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addingBrand, setAddingBrand] = useState(false);
  const [newBrand, setNewBrand] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    setModels(models.filter((m) => m.id !== id));
  };

  const handleEdit = (model) => {
    setForm({ name: model.name, brand: model.brand, series: model.series });
    setEditingId(model.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setModels(models.map((m) => (m.id === editingId ? { ...m, ...form } : m)));
      setEditingId(null);
    } else {
      setModels([...models, { id: Date.now(), ...form }]);
    }
    setForm({ name: "", brand: "", series: "" });
    setShowForm(false);
    setAddingBrand(false);
    setNewBrand("");
  };

  const handleAddBrand = () => {
    if (newBrand.trim()) {
      setBrands([...brands, newBrand.trim()]);
      setForm({ ...form, brand: newBrand.trim() });
      setNewBrand("");
      setAddingBrand(false);
    }
  };

  return (
    <div className="p-6 w-[90%] mx-auto text-white">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Models</h1>
        <button
          onClick={() => {
            setForm({ name: "", brand: "", series: "" });
            setEditingId(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 rounded-lg"
        >
          Add Model
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2">Model Name</th>
            <th className="p-2">Brand</th>
            <th className="p-2">Series</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.id} className="border-t border-gray-700">
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.brand}</td>
              <td className="p-2">{m.series}</td>
              <td className="p-2">
                <ActionButtons
                  onEdit={() => handleEdit(m)}
                  onDelete={() => handleDelete(m.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
          />

          {/* Brand Dropdown */}
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
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              >
                <option value="">Select Brand</option>
                {brands.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
                <option value="__add__">➕ Add New Brand</option>
              </select>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block mb-1">New Brand</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  placeholder="Enter brand name"
                />
                <button
                  type="button"
                  onClick={handleAddBrand}
                  className="px-3 py-2 bg-green-600 rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setAddingBrand(false)}
                  className="px-3 py-2 bg-red-600 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <InputField
            label="Series"
            name="series"
            value={form.series}
            onChange={handleChange}
          />
        </FormModal>
      )}
    </div>
  );
}
