import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import FilterSearchBar from "../../components/FilterSearchBar";
import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import SEO from "../../components/SEO";
import slugify from "slugify";

export default function PartDetails() {
  const { brand, brandId, partCategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState({});

  // Fetch category info
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/partCategories/${partCategoryId}`);
        setCategory(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategory();
  }, [partCategoryId]);

  // Fetch products
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
      setError("⚠️ Failed to load parts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [brand, brandId, partCategoryId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* SEO */}
      <SEO
        title={`${brand || ""} ${category?.name || ""} | Universal Combo List 2025`}
        description={`Find ${brand || "Mobile"} ${category?.name || "Spare"} parts at Universal Combo. Discover combo displays, touch panels, and repair tools – trusted by technicians and shops.`}
        keywords={`${brand || ""} ${category?.name || ""}, ${brand || ""} spare parts, universal combo list 2025, mobile spare parts website`}
        url={`https://universalcombo.com/models/${brand}/${brandId}/${category?.name ? slugify(category.name, { lower: true }) : ""}/${partCategoryId}`}
        image="https://universalcombo.com/UniversalCombo.jpg"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `${brand} ${category?.name || "Spare Parts"}`,
          "description": `Universal ${category?.name || "spare parts"} for ${brand} devices`,
          "url": `https://universalcombo.com/models/${brand}/${brandId}/${partCategoryId}`
        }}
      />

      <Header />

      {/* Hero Section */}
      <div className="text-center pt-20 pb-8 px-4">
        <h1 className="lg:text-4xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
          {brand}{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
            Universal {category?.name || "Spare Parts"}
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6">
          Explore <span className="font-semibold">{brand}</span>{" "}
          {category?.name || "parts"} –{" "}
          {products.length > 0
            ? products
                .slice(0, 5)
                .map((p) => p.name + " " + p.modelIds[0]?.name)
                .join(", ") + (products.length > 5 ? ", & more" : "")
            : "loading..."}
          .
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center pb-6 px-4">
        <FilterSearchBar
          items={products}
          search={search}
          setSearch={setSearch}
          placeholder={`🔍 Search ${brand} ${category?.name || "parts"}...`}
          onFilter={setFilteredProducts}
        />
      </div>

      <div className="p-6">
        {/* Error */}
        {error && (
          <p className="text-red-500 dark:text-red-400 text-center mb-6 font-medium">
            {error}
          </p>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-cyan-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
            No {category?.name} available for {brand} or match your search.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-blue-400"
              >
                {/* Product Name */}
                <h2 className="text-lg font-semibold dark:text-white mb-2">
                  {p.name} {p.modelIds[0]?.name}
                </h2>

                {/* Supported Models */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Supported Models:</span>{" "}
                  {p.modelIds.map((m) => m.name).join(", ")}
                </p>

                {/* Optional CTA */}
                {/* <button
                  className="mt-4 w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition"
                >
                  View Details
                </button> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
