import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import FilterSearchBar from "../../components/FilterSearchBar";
import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";

export default function PartDetails() {
  const { brand, brandId, partCategoryId, partCategoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false); // spinner state
  const [error, setError] = useState(""); // error state
  const [category,setCategory] = useState({})

  // Fetch products for the brand & category
  useEffect(() => {
  const fetchCategory = async () => {
    try {
      const res = await api.get(`/partCategories/${partCategoryId}`);
      setCategory(res.data); // res.data.name = "C Board"
      console.log(res.data)
    } catch (err) {
      console.error(err);
    }
  };
  fetchCategory();
}, [partCategoryId]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/products/${brand}/${brandId}/${partCategoryId}`
      );
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load parts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [brand, brandId, partCategoryId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      {/* Search Bar */}
      <div className="flex justify-center pt-25 ">
        <FilterSearchBar
          items={products}
          search={search}
          setSearch={setSearch}
          placeholder={`🔍 Search by name or supported model...`}
          onFilter={setFilteredProducts}
        />
      </div>

      <div className="p-6">
        <h1 className="pt-6 text-2xl font-bold dark:text-white mb-6 capitalize">
          {brand} Universal {category?.name} Parts
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-500 dark:text-red-400 text-center mb-4">{error}</p>
        )}

        {/* Loading Spinner */}
        {loading ? (
  <div className="flex justify-center items-center h-64">
    <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
  </div>
) : filteredProducts.length === 0 ? (
  <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
    No {category?.name} available for {brand} or match your search.
  </p>
) : (
  <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6">
    {filteredProducts.map((p) => (
      <div
        key={p._id}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
      >
        <h3 className="text-lg font-semibold dark:text-white">{p.name} {p.modelIds[0]?.name}</h3>
        <p className="text-sm text-gray-500 mt-3 dark:text-gray-400">
          <span className="font-semibold">Supported Models:</span>{" "}
          {p.modelIds.map((m) => m.name).join(", ")}
        </p>
        <span className="block mt-2 font-bold text-blue-600 dark:text-blue-400">
         
        </span>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}
