// pages/BrandPage.jsx
import React, { useState } from "react";
import InputField from "../components/dashboardComponents/InputField";
import FormModal from "../components/dashboardComponents/FormModal";
import ActionButtons from "../components/dashboardComponents/ActionButtons";

export default function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: "", country: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // track edit mode

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    setBrands(brands.filter((b) => b.id !== id));
  };

  const handleEdit = (brand) => {
    setForm({ name: brand.name, country: brand.country });
    setEditingId(brand.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // update existing brand
      setBrands(
        brands.map((b) =>
          b.id === editingId ? { ...b, ...form } : b
        )
      );
      setEditingId(null);
    } else {
      // add new brand
      setBrands([...brands, { id: Date.now(), ...form }]);
    }
    setForm({ name: "", country: "" });
    setShowForm(false);
  };

  return (
    <div className="p-6 w-[90%] mx-auto text-white">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Brands</h1>
        <button
          onClick={() => {
            setForm({ name: "", country: "" });
            setEditingId(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 rounded-lg"
        >
          Add Brand
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Country</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b) => (
            <tr key={b.id} className="border-t border-gray-700">
              <td className="p-2">{b.name}</td>
              <td className="p-2">{b.country}</td>
              <td className="p-2">
                <ActionButtons
                  onEdit={() => handleEdit(b)}
                  onDelete={() => handleDelete(b.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form Modal */}
      {showForm && (
        <FormModal
          title={editingId ? "Edit Brand" : "Add Brand"}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        >
          <InputField
            label="Brand Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <InputField
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
          />
        </FormModal>
      )}
    </div>
  );
}
