import { Link, useParams } from "react-router-dom";
import { combos } from "../data";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import Header from "../components/Header";



export default function ComboPage() {
  const { id } = useParams();
  const combo = combos.find((c) => c.id === parseInt(id));
  const [search, setSearch] = useState("");

  if (!combo) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header></Header>
       
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-red-500 dark:text-red-400 text-lg font-semibold">
            ❌ Combo not found
          </p>
        </div>
      </div>
    );
  }

  // Filter models by search
  const filteredModels = combo.models?.filter(
    (model) =>
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.supportedMobiles.some((m) =>
        m.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
     
       <Header></Header>
      <div className="max-w-5xl mx-auto p-6">
        {/* SearchBar */}
        <div className="flex justify-center mb-6">
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {/* Combo Info */}
        <h1 className="text-3xl font-bold mb-3">{combo.name}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          💰 <span className="font-semibold">{combo.price}</span> | ⏳{" "}
          <span className="font-semibold">{combo.duration}</span>
        </p>

        {/* Models */}
        <h2 className="text-2xl font-semibold mb-5">Supported Models</h2>

        {filteredModels && filteredModels.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 
                           bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg 
                           transition transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold mb-3">{model.name}</h3>

                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-400">
                  {model.supportedMobiles.slice(0, 3).map((mobile, idx) => (
                    <li key={idx}>{mobile}</li>
                  ))}
                </ul>

                {/* View Details Button */}
                <Link
               
                  to={`/combo/${id}/${model.id}`} 
                  className="mt-4 inline-block px-4 py-2 cursor-pointer bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No models found for "{search}"
          </p>
        )}
      </div>
    </div>
  );
}
