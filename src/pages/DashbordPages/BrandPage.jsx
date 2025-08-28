// pages/BrandPage.jsx
import React, { useState, useEffect } from "react";
import InputField from "../../components/dashboardComponents/InputField";
import FormModal from "../../components/dashboardComponents/FormModal";
import ActionButtons from "../../components/dashboardComponents/ActionButtons";
import axios from "axios";

export default function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [formdata, setFormdata] = useState({ name: "", country: "", category: "" });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
const [deviceCategories,setdeviceCategories] =useState([])
  // Fetch brands when component mounts
  useEffect(() => {
    fetchBrands();
    fetchDeviceCategories();
  }, []);

const fetchDeviceCategories =async()=>{
  const res = await axios.get("/api/deviceCategories"); 
  console.log(`res Data:`,res.data)
  setdeviceCategories(res.data)
  console.log(setdeviceCategories)
}
  
  const fetchBrands = async () => {
    try {
      const res = await axios.get("/api/brands");
      setBrands(res.data);
      console.log(res.data) 
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };


  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name:formdata.name,
      country:formdata.country,
       deviceCategoryId: formdata.category
        }
    console.log("Submitting:", payload);
    try {
      if (editing) {

        await axios.put(`/api/brands/${editing._id}`, payload);
      } else {
     
        await axios.post("/api/brands", payload);
      }
      setFormdata({ name: "", country: "" });
      setEditing(null);
      setShowForm(false);
      fetchBrands(); // refresh list
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  const handleEdit = (brand) => {
    setFormdata({ name: brand.name, country: brand.country });
    setEditing(brand);
    setShowForm(true);
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/brands/${id}`);
      setBrands(brands.filter((b) => b._id !== id));
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
            setFormdata({ name: "", country: "" });
            setEditing(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Add Brand
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left border border-gray-700 rounded-lg">
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
            <tr key={b._id} className="border-t border-gray-700">
              <td className="p-2">{b.name}</td>
              <td className="p-2">{b.country}</td>
              <td className="p-2">{b.deviceCategoryId.name}</td>
              <td className="p-2">
                <ActionButtons
                  onEdit={() => handleEdit(b)}
                  onDelete={() => handleDelete(b._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form Modal */}
      {showForm && (
        <FormModal
          title={editing ? "Edit Brand" : "Add Brand"}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        >
          <InputField
            label="Brand Name"
            name="name"
            value={formdata.name}
            onChange={handleChange}
          />
          <label className="block mb-2">Category</label>
<select
  name="category"
  value={formdata.category}
  onChange={handleChange}
  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
>
  <option value="">Select Category</option>
  {deviceCategories.map((c) => (
    <option key={c._id} value={c._id}>
      {c.name}
    </option>
  ))}
</select>

          <InputField
            label="Country"
            name="country"
            value={formdata.country}
            onChange={handleChange}
          />
        </FormModal>
      )}
    </div>
  );
}
