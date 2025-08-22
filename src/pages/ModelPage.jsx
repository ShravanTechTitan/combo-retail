import { useParams, Link } from "react-router-dom";
import { combos } from "../data";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import Header from "../components/Header";

export default function ModelPage() {
  const { id, modelId } = useParams();
  const combo = combos.find((c) => c.id === parseInt(id));
  const model = combo?.models.find((m) => m.id === parseInt(modelId));
  const [search, setSearch] = useState("");

  if (!combo || !model) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-500 transition-colors duration-300">
        ❌ Model not found
        <Link to="/" className="text-blue-500 underline mt-4">
          Go Home
        </Link>
      </div>
    );
  }

  // Filter supported mobiles
  const filteredMobiles = model.supportedMobiles.filter((mobile) =>
    mobile.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <Header />

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* SearchBar */}
        <div className="flex justify-center">
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {/* Combo & Model Info */}
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold dark:text-white">{model.name}</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Part of <span className="font-semibold">{combo.name}</span>
          </p>
        </div>

        {/* Supported Mobiles */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 dark:text-white">
            Supported Mobiles
          </h3>
          {filteredMobiles.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMobiles.map((mobile, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 text-gray-900 dark:text-gray-100"
                >
                  {mobile}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No mobiles match "{search}"
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
