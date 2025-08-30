import { useState, useRef, useEffect } from "react";
import axios from "axios";
import MultiSelect from "../../components/dashboardComponents/MultiSelect";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const brandRef = useRef(null);
  const modelRef = useRef(null);

  const initialForm = {
    id: "",
    brand: [],
    vendor: "",
    category: "",
    model: [],
    partCode: "",
    name: "",
    price: "",
    stock: "",
    description: "",
    warranty: "",
  };

  const [form, setForm] = useState(initialForm);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const[partCategory,setPartCategory]= useState([])
  const [openBrandDropdown, setOpenBrandDropdown] = useState(false);
  const [openModelDropdown, setOpenModelDropdown] = useState(false);

  
  
  const fetchBrands = async () => {
    try {
      const res = await axios.get("/brands");
      setBrands(res.data)
      
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };
  const fetchModels = async () => {
    try {
      const res = await axios.get("/models");
      setModels(res.data)
    } catch (error) {
      console.error("Error fetching modelss:", error);
    }
  };
  const fetchPartCategories =async()=>{
  const res = await axios.get("/partCategories"); 
  
  setPartCategory(res.data)

}
  const fetchProducts =async()=>{
  const res = await axios.get("/products"); 

  setProducts(res.data)
    }
 useEffect(()=>{
  fetchBrands()
  fetchModels()
  fetchPartCategories()
  fetchProducts()
  
 },[])

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async(e) => {
    e.preventDefault();
    const payloads = {
      name:form.name,
      partCategoryId:form.category || "",
      modelIds:form.model.map((m)=>m.value) || [],
      brandIds:form.brand.map((b)=>b.value)  || [],
      price:Number(form.price),
      description:form.description,
      
    }
    console.log(payloads)
    if (editingId) {
     await axios.put(`/api/products/${editingId}`,payloads)
      
    } else {
      await axios.post("/api/products",payloads)
    }
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    fetchProducts()
  };

 const handleEdit = (id) => {
  const product = products.find((p) => p._id === id);

  setForm({
    id: product._id || "",
    brand: product.brandIds.map(b => ({ label: b.name, value: b._id })),
    category: product.partCategoryId?._id || "",
    model: product.modelIds.map(m => ({ label: m.name, value: m._id })),
    name: product.name || "",
    price: product.price || "",
    stock: product.stock || "",
    description: product.description || "",
    warranty: product.warranty || "",
  });

  setEditingId(product._id);
  setShowForm(true);
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting Products:", error);
    }
  };
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors">
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
              <th className="p-2 text-left text-sm">Name</th>
              <th className="p-2 text-left text-sm">Brand</th>
              {/* <th className="p-2 text-left text-sm">Vendor</th> */}
              <th className="p-2 text-left text-sm">Category</th>
              <th className="p-2 text-left text-sm">Model</th>
              <th className="p-2 text-left text-sm">Price</th>
              {/* <th className="p-2 text-left text-sm">Stock</th>
              <th className="p-2 text-left text-sm">Warranty</th> */}
              <th className="p-2 text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center p-4 text-gray-500 dark:text-gray-400 italic"
                >
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
                  <td className="p-2 text-sm">{p.brandIds.map((b)=>b.name).join(', ')}</td>
                  {/* <td className="p-2 text-sm">{p.vendor}</td> */}
                  <td className="p-2 text-sm">{p.partCategoryId.name}</td>
                  <td className="p-2 text-sm">{p.modelIds.map((m)=>m.name).join(", ")}</td>
                  <td className="p-2 text-sm">₹{p.price}</td>
                  {/* <td className="p-2 text-sm">{p.stock}</td>
                  <td className="p-2 text-sm">{p.warranty}</td> */}
                  <td className="p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(p._id)}
                      className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto p-8 transition-colors">
            <h3 className="text-xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">
              {editingId ? "Edit Product" : "Add Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Brand Multi-Select */}
               <div className="flex gap-4">
  <input
    type="text"
    name="name"
    value={form.name}
    onChange={handleChange}
    placeholder="Product Name"
    className="w-1/2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
  />
  <select
    name="category"
    value={form.category}
    onChange={handleChange}
    className="w-1/2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
  >
    <option value="">Select Category</option>
    {partCategory.map((c) => (
      <option key={c._id} value={c._id}>
        {c.name}
      </option>
    ))}
  </select>
</div>


        <div ref={brandRef} className="relative">
                <MultiSelect
                label="Brand"
                options={brands.map(b => ({ label: b.name, value: b._id }))}
                selected={form.brand}
                onChange={(val) => setForm((prev) => ({ ...prev, brand: val }))}
                placeholder="Select Brand"
              />
             </div>
     
              <div ref={modelRef} className="relative">
               
                <MultiSelect
                label="Model"
                options={models.map(m => ({ label: m.name, value: m._id }))}
                selected={form.model}
                onChange={(val) => setForm((prev) => ({ ...prev, model: val }))}
                placeholder="Select Model"
              />                    
              </div>
      
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
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
                <input
                  type="text"
                  name="warranty"
                  value={form.warranty}
                  onChange={handleChange}
                  placeholder="Warranty"
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
              </div>

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
