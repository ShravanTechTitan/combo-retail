import { useState, useEffect, useRef } from "react";
import api from "../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { FaHistory, FaFire, FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({ search, setSearch, type }) {
  const [suggestions, setSuggestions] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchTips, setSearchTips] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch popular searches on mount
    fetchPopularSearches();
    loadRecentSearches();
    loadSearchTips();
  }, []);

  // Load recent searches from localStorage
  const loadRecentSearches = () => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      setRecentSearches(recent.slice(0, 5));
    } catch (err) {
      console.error("Error loading recent searches:", err);
    }
  };

  // Save search to recent searches
  const saveToRecentSearches = (query) => {
    if (!query || query.trim().length < 2) return;
    try {
      const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      const updated = [query.trim(), ...recent.filter(s => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 10);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      setRecentSearches(updated.slice(0, 5));
    } catch (err) {
      console.error("Error saving recent search:", err);
    }
  };

  // Load search tips
  const loadSearchTips = () => {
    setSearchTips([
      "💡 Try searching by brand name (e.g., Samsung)",
      "💡 Search by model number (e.g., M11, A50)",
      "💡 Use product name (e.g., Display, Battery)",
      "💡 Combine brand + model (e.g., Samsung M11)"
    ]);
  };

  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    if (search.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search/autocomplete?q=${encodeURIComponent(search)}`);
        setSuggestions(res.data.suggestions || []);
        setPopularSearches(res.data.popular || []);
      } catch (err) {
        console.error(err);
        // Fallback to old search
        try {
          const fallbackRes = await api.get(`/search?q=${encodeURIComponent(search)}&type=${type}`);
          setSuggestions(fallbackRes.data || []);
        } catch (fallbackErr) {
          console.error("Fallback search error:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };
    

    const delay = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(delay);
  }, [search, type]);

  const fetchPopularSearches = async () => {
    try {
      const res = await api.get("/search/suggestions");
      setPopularSearches(res.data.popular?.slice(0, 5).map(s => s.query) || []);
    } catch (err) {
      console.error("Error fetching popular searches:", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      saveToRecentSearches(search);
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setShowSuggestions(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions) return;

      const allItems = [
        ...(suggestions.slice(0, 8) || []),
        ...(search.length < 2 && recentSearches.length > 0 ? recentSearches.map(s => ({ type: 'recent', query: s })) : []),
        ...(search.length < 2 && popularSearches.length > 0 ? popularSearches.map(s => ({ type: 'popular', query: s })) : [])
      ];

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0 && allItems[selectedIndex]) {
        e.preventDefault();
        const item = allItems[selectedIndex];
        if (item.productId) {
          navigate(`/product/${item.productId}`);
          setShowSuggestions(false);
          setSearch("");
        } else if (item.query) {
          setSearch(item.query);
          saveToRecentSearches(item.query);
          navigate(`/search?q=${encodeURIComponent(item.query)}`);
          setShowSuggestions(false);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    if (showSuggestions) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [showSuggestions, selectedIndex, suggestions, recentSearches, popularSearches, search, navigate]);

  // Clear recent searches
  const clearRecentSearches = () => {
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };

  // Highlight search term in text
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };


  return (
    <div className="relative w-full sm:w-72 md:w-96 z-[100]">
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <FaSearch className="text-sm" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder={`Search ${type}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={(e) => {
              // Delay closing to allow click events on suggestions to fire first
              setTimeout(() => {
                // Check if the new active element is not inside suggestions container
                const activeElement = document.activeElement;
                if (!activeElement?.closest('.suggestions-container')) {
                  setShowSuggestions(false);
                  setSelectedIndex(-1);
                }
              }, 250);
            }}
            className="w-full border pl-10 pr-10 py-3 sm:py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-base sm:text-sm min-h-[44px] touch-manipulation relative z-[100]"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSuggestions([]);
                setSelectedIndex(-1);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-[101] p-1"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && (loading || suggestions.length > 0 || popularSearches.length > 0 || recentSearches.length > 0 || search.length >= 2) && (
        <div 
          ref={suggestionsRef}
          className="suggestions-container absolute left-0 right-0 bg-white dark:bg-gray-700 border rounded-lg mt-1 shadow-2xl z-[9999] max-h-[500px] overflow-y-auto"
          onMouseDown={(e) => e.preventDefault()}
        >
          {loading && (
            <div className="flex justify-center items-center py-6">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {!loading && (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && search.length < 2 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FaHistory className="text-xs" /> Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((query, idx) => {
                    const index = idx;
                    return (
                      <button
                        key={`recent-${idx}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearch(query);
                          saveToRecentSearches(query);
                          navigate(`/search?q=${encodeURIComponent(query)}`);
                          setShowSuggestions(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 ${
                          selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <FaHistory className="text-xs text-gray-400" />
                        <span>{query}</span>
                      </button>
                    );
                  })}
                </>
              )}

              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
                    <FaSearch className="text-xs" /> Suggestions ({suggestions.length})
                  </div>
                  {suggestions.slice(0, 8).map((item, idx) => {
                    const index = recentSearches.length + idx;
                    return (
                      <Link
                        key={`${item.productId}-${item.modelId || "single"}-${item.label}`}
                        to={`/product/${item.productId}`}
                        className={`block px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 border-b dark:border-gray-600 ${
                          selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onClick={() => {
                          saveToRecentSearches(search);
                          setShowSuggestions(false);
                          setSearch("");
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FaSearch className="text-xs text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                              {highlightText(item.label, search)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded flex-shrink-0 ml-2">
                            {item.matchType}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </>
              )}

              {/* Popular Searches */}
              {popularSearches.length > 0 && search.length < 2 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
                    <FaFire className="text-xs" /> Popular Searches
                  </div>
                  {popularSearches.map((query, idx) => {
                    const index = recentSearches.length + suggestions.length + idx;
                    return (
                      <button
                        key={`popular-${idx}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onClick={() => {
                          setSearch(query);
                          saveToRecentSearches(query);
                          navigate(`/search?q=${encodeURIComponent(query)}`);
                          setShowSuggestions(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 ${
                          selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <FaFire className="text-xs text-orange-500" />
                        <span>{query}</span>
                      </button>
                    );
                  })}
                </>
              )}

              {/* Search Tips */}
              {search.length === 0 && suggestions.length === 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                    💡 Search Tips
                  </div>
                  {searchTips.map((tip, idx) => (
                    <div key={idx} className="px-4 py-2 text-xs text-gray-600 dark:text-gray-400 border-b dark:border-gray-600">
                      {tip}
                    </div>
                  ))}
                </>
              )}

              {/* No Results */}
              {suggestions.length === 0 && search.length >= 2 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No results found for "{search}"</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={() => {
                        saveToRecentSearches(search);
                        navigate(`/search?q=${encodeURIComponent(search)}`);
                        setShowSuggestions(false);
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      View all results →
                    </button>
                    <span className="text-gray-400 hidden sm:inline">|</span>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={() => {
                        saveToRecentSearches(search);
                        navigate(`/search?q=${encodeURIComponent(search)}`);
                        setShowSuggestions(false);
                      }}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      Advanced Search →
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Actions Footer */}
              {search.length > 0 && (
                <div className="px-4 py-2 border-t dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> to search
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑↓</kbd> to navigate
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
