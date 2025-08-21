import { useState } from "react";
import ComboCard from "../components/ComboCard";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import { combos } from "../data";
import { useNavigate } from "react-router-dom";

const modal = [
  { id: 1, name: "Samsung", type: "mobile" },
  { id: 2, name: "Vivo", type: "mobile" },
  { id: 3, name: "MI", type: "mobile" },
  { id: 4, name: "iPhone", type: "mobile" },
  { id: 5, name: "Poco", type: "mobile" },
  { id: 6, name: "OnePlus", type: "mobile" },
  { id: 7, name: "Motorola", type: "mobile" },
  { id: 8, name: "Redmi", type: "mobile" },
  { id: 9, name: "Realme", type: "mobile" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredCombos = combos.filter((combo) =>
    combo.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <div className="flex justify-center p-4">
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* Model Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {modal.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/models/${m.name.toLowerCase()}`)}
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 p-6 flex flex-col items-center text-center"
          >
            {/* Icon / Placeholder image */}
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
              {m.name.charAt(0)}
            </div>

            {/* Model Name */}
            <h3 className="text-lg font-semibold dark:text-white">{m.name}</h3>

            {/* Subtitle */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {m.type}
            </p>

            {/* Action */}
            <span className="text-sm font-medium text-green-600 dark:text-blue-400 hover:underline">
              View Spare Parts →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
