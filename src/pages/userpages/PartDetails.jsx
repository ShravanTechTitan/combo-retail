import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";

const modelData = {
  samsung: {
    name: "Samsung",
    parts: {
      battery: [
        {
          id: "B345",
          name: "Samsung Battery B345",
          price: "₹1,199",
          supportedModels: ["F14", "F15", "F23",],
        },
        {
          id: "B410",
          name: "Samsung Battery B410",
          price: "₹1,399",
          supportedModels: ["S20", "S20+", "S20 Ultra"],
        },
        {
          id: "B512",
          name: "Samsung Battery B512",
          price: "₹1,599",
          supportedModels: ["A14", "A34", "M14"],
        },
       
      ],
      display: [
        {
          id: "D200",
          name: "Samsung AMOLED Display D200",
          price: "₹2,999",
          supportedModels: ["S20", "S20+"],
        },
        {
          id: "D201",
          name: "Samsung LCD Display D201",
          price: "₹1,999",
          supportedModels: ["F14", "F15", "F23"],
        },
        {
          id: "D350",
          name: "Samsung Super AMOLED Display D350",
          price: "₹3,499",
          supportedModels: ["A54", "A72", "M54"],
        },
    
      ],
    },
  },
};

export default function PartDetails() {
  const { brand, partType } = useParams();
  const data = modelData[brand?.toLowerCase()];

  if (!data || !data.parts[partType]) {
    return (
      <h2 className="p-6">
        No {partType} available for {brand}
      </h2>
    );
  }

  const parts = data.parts[partType];

  return (
     <div className=" min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header></Header>
         <div  className="flex justify-center pt-4">
        
                <SearchBar></SearchBar>
                </div>
    <div className="p-6">
        
      <h1 className=" pt-6 text-2xl font-bold dark:text-white mb-6">
        {data.name} {partType.charAt(0).toUpperCase() + partType.slice(1)} Parts
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6">
        {parts.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold dark:text-white">{p.name}</h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Supported Models:</span>{" "}
              {p.supportedModels.join(", ")}
            </p>

            <span className="block mt-2 font-bold text-blue-600 dark:text-blue-400">
              {p.price}
            </span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
