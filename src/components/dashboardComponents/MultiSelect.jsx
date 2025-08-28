import { useState, useRef, useEffect } from "react";

export default function MultiSelect({
  label = "Select",
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef();
const filteredOptions = options.filter(
  (opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()) &&
    !selected.some((s) => s.value === opt.value)
);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    onChange([...selected, value]);
    setSearch("");
  };

  const handleRemove = (value) => {
    onChange(selected.filter((s) => s !== value));
  };

  return (
    <div ref={dropdownRef} className="relative ">
      

    <div className="mt-5 Block">
      <div
        onClick={() => setOpenDropdown(true)}
        className="flex flex-wrap gap-1 w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 cursor-text"
      >
       {selected.map((s) => (
          <span key={s.value} className="bg-blue-500 text-white px-2 py-1 rounded flex items-center text-sm">
            {s.label}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(s);
              }}
              className="ml-1 text-xs hover:text-red-300"
            >
              ✕
            </button>
          </span>
        ))}


        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={selected.length === 0 ? placeholder : ""}
          className="flex-grow bg-transparent outline-none text-sm p-1"
        />
      </div>

      {openDropdown && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 mt-1 rounded max-h-40 overflow-y-auto">
            {filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                {opt.label}
              </div>
            ))}
        </div>
      )}
      </div>
    </div>
  );
}
