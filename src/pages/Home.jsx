import { useEffect, useState } from "react";
import ComboCard from "../components/ComboCard";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

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

      {/* Search Bar */}
      <div className="flex justify-center p-4">
        <SearchBar
          search={search}
          setSearch={setSearch}
          endpoint="/api/products/search"
          linkBuilder={(item) => `/product/${item._id}`}
          type={"product"}
        />
      </div>

      {/* Brands / Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {brands.map((m) => (
            <div
              key={m._id}
              onClick={() => navigate(`/models/${m.name}/${m._id}`)}
              className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                {m.name.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold dark:text-white">{m.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {m.deviceCategoryId.name}
              </p>
              <span className="text-sm font-medium text-green-600 dark:text-blue-400 hover:underline">
                View Spare Parts →
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
