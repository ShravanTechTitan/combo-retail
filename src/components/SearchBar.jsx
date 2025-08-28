import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export default function SearchBar({ search, setSearch, type }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!search) return setSuggestions([]);
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`/api/search?q=${search}&type=${type}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [search, type]);

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

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 bg-white dark:bg-gray-700 border rounded-lg mt-1 shadow-lg z-10">
          {suggestions.map((item) => (
            <Link
              key={item._id}
              to={`/${type}/${item._id}`}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
