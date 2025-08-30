import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import FilterSearchBar from "../../components/FilterSearchBar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ModelDetails() {
  const [products, setProducts] = useState([]);
  const [partCategories, setPartCategories] = useState([]);
  const [search, setSearch] = useState("");

  const { brand, brandId } = useParams();
  const navigate = useNavigate();

  // Fetch products for the brand
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/products/${brand}/${brandId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
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
    }
  }, [products]);

  // Filter categories based on search
  const filteredCategories = partCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Search Bar */}
      <div className="flex justify-center pt-6">
        <FilterSearchBar
          items={partCategories}
          search={search}
          setSearch={setSearch}
          placeholder={`🔍 Search categories...`}
          filterKey="name"
        />

      </div>

      {/* Page Title */}
      <div className="p-6">
        <h1 className="text-3xl font-bold dark:text-white mb-6 capitalize">
          {brand} Spare Parts
        </h1>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              onClick={() =>
                navigate(
                  `/models/${brand}/${brandId}/${category.name}/${category._id}`
                )
              }
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

          {filteredCategories.length === 0 && (
            <p className="col-span-full text-gray-500 dark:text-gray-400 text-center mt-4">
              No categories match your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
