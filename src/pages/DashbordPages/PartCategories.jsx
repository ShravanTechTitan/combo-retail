import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import InputField from "../../components/dashboardComponents/InputField";
import ActionButtons from "../../components/dashboardComponents/ActionButtons";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog";

export default function PartCategoryPage() {
  const [Partcategories, setPartCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(()=>{
    fatchPartCategories()
  },[])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
 const fatchPartCategories = async()=>{
  try{
    const res = await axios.get("/api/partCategories")
    console.log(res)
    setPartCategories(res.data);
  }catch(err){
    console.error("Error fetching partCategories:", err);
  }

 }




  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
    if (editing) {
      await axios.put(`/api/partCategories/${editing._id}`, formData);
    } else {
      await axios.post("/api/partCategories", formData);
    }
     fatchPartCategories();
    setFormData({ name: "", description: "" });
    setEditing(null);
    setShowForm(false);
  
}catch(err){
  console.error("Error saving part category:", err);
  }

}
  

  const handleEdit = (cat) => {
    setEditing(cat);
    setFormData({ name: cat.name, description: cat.description });
    setShowForm(true);
  };

  const confirmDelete = async (id)=>{
    console.log(id)
    try{
      axios.delete(`/api/partCategories/${deleteId}`)
      fatchPartCategories();
      setConfirmOpen(false);
      setDeleteId(null);
    }catch(err){
       console.error("Error deleting device category:", err);
    }
  }

  return (
    <div className="p-4 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">Manage Device Part Categories</h2>
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
            {Partcategories.map((c) => (
              <tr
                key={c._id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2">{c.description}</td>
                <td className="px-3 py-2 text-center">
                  <ActionButtons onEdit={() => handleEdit(c)} onDelete={() => {
                    setDeleteId(c._id);
                     setConfirmOpen(true);}} />
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
              {editing ? "Edit Device Part Category" : "Add New Device Part Category"}
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
      <ConfirmDialog 
  isOpen={confirmOpen} 
  title="Delete Category"
  message="This action cannot be undone. Are you sure you want to delete this category?"
  onCancel={() => setConfirmOpen(false)}
  onConfirm={confirmDelete}
/>

    </div>
  );
}