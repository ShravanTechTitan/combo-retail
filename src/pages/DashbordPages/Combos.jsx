import { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const sampleCombos = [
  { id: 1, name: "Combo A", price: "$50", duration: "30 days" },
  { id: 2, name: "Combo B", price: "$70", duration: "45 days" },
];

export default function Combos() {
  const [combos, setCombos] = useState(sampleCombos);
  const [showForm, setShowForm] = useState(false);
  const [newCombo, setNewCombo] = useState({ name: "", price: "", duration: "" });

  // Handle input change
  const handleChange = (e) => {
    setNewCombo({ ...newCombo, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCombo.name || !newCombo.price || !newCombo.duration) return;

    const newEntry = { ...newCombo, id: Date.now() };
    setCombos([...combos, newEntry]);
    setNewCombo({ name: "", price: "", duration: "" });
    setShowForm(false);
  };

  return (
    <div className="p-4 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm md:text-base dark:text-gray-100 text-gray-800 font-semibold">
          Manage Combos
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm transition"
        >
          <FaPlus size={12} /> Add Combo
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full text-xs md:text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="text-left px-3 py-2 font-medium">Name</th>
              <th className="text-left px-3 py-2 font-medium">Price</th>
              <th className="text-left px-3 py-2 font-medium">Duration</th>
              <th className="px-3 py-2 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((combo) => (
              <tr
                key={combo.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-3 py-2">{combo.name}</td>
                <td className="px-3 py-2">{combo.price}</td>
                <td className="px-3 py-2">{combo.duration}</td>
                <td className="px-3 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-[11px] shadow-sm transition">
                      <FaEdit size={12} /> Edit
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-[11px] shadow-sm transition">
                      <FaTrash size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg w-80">
            <h3 className="text-sm md:text-base font-semibold mb-3 dark:text-white">Add New Combo</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Combo Name"
                value={newCombo.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={newCombo.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={newCombo.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:text-white"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 bg-gray-400 hover:bg-gray-500 text-white text-xs rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md"
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
