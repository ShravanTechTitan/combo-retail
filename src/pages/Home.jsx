import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import "../assets/home.css";

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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-6">
          Perfect Solution for Mobile Technicians, Shop Owners, and Staff
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
              className="brand-card cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md 
                         transition-transform transform hover:-translate-y-1 p-3 sm:p-5 flex flex-col items-center text-center"
            >
              {/* Mobile Layout */}
              <div className="flex items-center justify-between w-full sm:hidden">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {m.name.charAt(0)}
                  </div>
                  <h3 className="text-sm font-semibold dark:text-white">{m.name}</h3>
                </div>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  View Spare Parts →
                </span>
              </div>

              {/* Desktop Layout */}
              <div className="flex flex-col items-center">

                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                  {m.name.charAt(0)}
                </div>
                <h3 className="text-base font-semibold dark:text-white">{m.name}</h3>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-2 hover:underline">
                  View Spare Parts →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
