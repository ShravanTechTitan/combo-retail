import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";

export default function Home() {
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get("/brands");
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-56">
        {/* Hero Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-6">
          Helpful for mobile technicians, shop owners, and staff
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-md px-4">
          <SearchBar
            search={search}
            setSearch={setSearch}
            endpoint="/api/products/search"
            linkBuilder={(item) => `/product/${item._id}`}
            type={"models"}
          />
        </div>
      </div>

      {/* Brands Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64 mt-6">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 mt-6">
          {brands.map((m) => (
            <div
              key={m._id}
              onClick={() => {
                const slug = slugify(m.name, { lower: true });
                navigate(`/models/${slug}/${m._id}`);
              }}
              className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 p-5 flex flex-col items-center text-sm text-center"
            >
              {/* Brand initials circle */}
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                {m.name.charAt(0)}
              </div>

              {/* Brand Name */}
              <h3 className="text-base font-semibold dark:text-white">{m.name}</h3>

              {/* Category */}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {m.deviceCategoryId.name}
              </p>

              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-2 hover:underline">
                View Spare Parts →
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
