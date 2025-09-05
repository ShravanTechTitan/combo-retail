import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";

export default function SearchBar({ search, setSearch, type }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${search}&type=${type}`);
        console.log("Search term:", search, "Search type", type);
        console.log("API RESPONSE 👉", res.data);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(delay);
  }, [search, type]);

  // Count of total matching items (including all models)
  const totalMatches = suggestions.reduce(
    (acc, item) => acc + (item.modelIds?.length > 0 ? item.modelIds.length : 1),
    0
  );

  return (
    <div className="relative w-72 sm:w-96">
      <input
        type="text"
        placeholder={`🔍 Search ${type}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
        >
          ❌
        </button>
      )}

      {(loading || suggestions.length > 0) && (
        <div className="absolute left-0 right-0 bg-white dark:bg-gray-700 border rounded-lg mt-1 shadow-lg z-10">
          {loading && (
            <div className="flex justify-center items-center py-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          )}
          {!loading && (
            <>
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300">
                {totalMatches} product{totalMatches > 1 ? "s" : ""} found
              </div>
              {suggestions.flatMap((item) =>
                item.modelIds && item.modelIds.length > 0
                  ? item.modelIds.map((model) => (
                      <Link
                        key={`${item._id}-${model._id}`}
                        to={`/${type}/${item._id}?model=${model.name}`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        {item.name} {model.name} - {item.partCategoryId?.name || "Single"}
                      </Link>
                    ))
                  : [
                      <Link
                        key={item._id}
                        to={`/${type}/${item._id}`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        {item.name} - {item.partCategoryId?.name || "Single"}
                      </Link>,
                    ]
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
