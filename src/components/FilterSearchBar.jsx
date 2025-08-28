import { useEffect, useMemo } from "react";

export default function FilterSearchBar({
  items = [],
  search,
  setSearch,
  placeholder,
  onFilter,
}) {
  // Memoize filtered items so filtering recalculates only when items or search change
  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.modelIds?.some((m) =>
          m.name.toLowerCase().includes(search.toLowerCase())
        )
    );
  }, [items, search]);

  // Update parent only after render
  useEffect(() => {
    if (onFilter) onFilter(filteredItems);
  }, [filteredItems, onFilter]);

  return (
    <div className="relative w-72 sm:w-96">
      <input
        type="text"
        placeholder={placeholder || "🔍 Search..."}
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
    </div>
  );
}
