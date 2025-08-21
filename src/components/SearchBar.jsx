export default function SearchBar({ search, setSearch }) {
  return (
    <div className="relative w-72 sm:w-96">
      <input
        type="text"
        placeholder="🔍 Search combos or models..."
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
