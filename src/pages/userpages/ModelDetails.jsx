import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import FilterSearchBar from "../../components/FilterSearchBar";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import slugify from "slugify";

export default function ModelDetails() {
  const [products, setProducts] = useState([]);
  const [partCategories, setPartCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false); // spinner state
  const [error, setError] = useState(""); // error state
  
  const { brand, brandId } = useParams();
  const navigate = useNavigate();

  // Fetch products for the brand
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/products/${brand}/${brandId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [brand, brandId]);

  // Extract unique categories from products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [
        ...new Map(
          products.map((p) => [p.partCategoryId._id, p.partCategoryId])
        ).values(),
      ];
      setPartCategories(uniqueCategories);
    } else {
      setPartCategories([]);
    }
  }, [products]);

  // Filter categories based on search
  const filteredCategories = partCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      {/* Search Bar */}
      <div className="flex justify-center pt-25">
        <FilterSearchBar
          items={partCategories}
          search={search}
          setSearch={setSearch}
          placeholder="🔍 Search categories..."
          filterKey="name"
        />
      </div>

      <div className="p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold dark:text-white mb-6 capitalize">
          {brand} Universal Spare Parts
        </h1>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 dark:text-red-400 text-center mb-4">
            {error}
          </p>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          // Categories Grid
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                onClick={() =>{
                  const slug = slugify(category.name, { lower: true });
                  navigate(
                    `/models/${brand}/${brandId}/${slug}/${category._id}`
                  )
                }}
                className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <h3 className="text-lg font-semibold dark:text-white capitalize mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View all {category.name} parts
                </p>
              </div>
            ))}

            {filteredCategories.length === 0 && !loading && (
              <p className="col-span-full text-gray-500 dark:text-gray-400 text-center mt-4">
                No categories match your search.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
