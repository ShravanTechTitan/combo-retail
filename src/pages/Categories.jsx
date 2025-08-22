import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import InputField from "../components/dashboardComponents/InputField";
import ActionButtons from "../components/dashboardComponents/ActionButtons";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setCategories(categories.map((c) => (c.id === editing.id ? { ...editing, ...formData } : c)));
    } else {
      setCategories([...categories, { id: Date.now(), ...formData }]);
    }
    setFormData({ name: "", description: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setFormData({ name: cat.name, description: cat.description });
    setShowForm(true);
  };

  const handleDelete = (id) => setCategories(categories.filter((c) => c.id !== id));

  return (
    <div className="p-4 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">Manage Categories</h2>
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
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full text-xs md:text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr
                key={c.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2">{c.description}</td>
                <td className="px-3 py-2 text-center">
                  <ActionButtons onEdit={() => handleEdit(c)} onDelete={() => handleDelete(c.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl w-full max-w-lg">
            <h3 className="text-lg font-bold mb-5 border-b border-gray-700 pb-2">
              {editing ? "Edit Category" : "Add New Category"}
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
    </div>
  );
}
