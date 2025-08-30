import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import FilterSearchBar from "../../components/FilterSearchBar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PartDetails() {
  const { brand, brandId, partCategoryId, partCategoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch products for the brand & category
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `/products/${brand}/${brandId}/${partCategoryId}`
      );
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [brand, brandId, partCategoryId]);

  if (!products || products.length === 0) {
    return (
      <h2 className="p-6 dark:text-white">
        No {partCategoryName} available for {brand}
      </h2>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Search Bar */}
      <div className="flex justify-center pt-4">
        <FilterSearchBar
          items={products}
          search={search}
          setSearch={setSearch}
          placeholder={`🔍 Search by name or supported model...`}
          onFilter={setFilteredProducts}
        />
      </div>

      {/* Products Grid */}
      <div className="p-6">
        <h1 className="pt-6 text-2xl font-bold dark:text-white mb-6">
          {brand} {partCategoryName.charAt(0).toUpperCase() + partCategoryName.slice(1)} Parts
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold dark:text-white">{p.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Supported Models:</span>{" "}
                {p.modelIds.map((m) => m.name).join(", ")}
              </p>
              <span className="block mt-2 font-bold text-blue-600 dark:text-blue-400">
                ₹{p.price}
              </span>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <p className="col-span-full text-gray-500 dark:text-gray-400 text-center mt-4">
              No parts match your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
