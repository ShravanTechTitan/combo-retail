import { useParams,useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
export const modelData = {
  samsung: {
    name: "Samsung",
    parts: {
      battery: [
        { id: 1, model: "S20", name: "Samsung S20 Battery", price: "₹1,299" },
        { id: 2, model: "F14", name: "Samsung F14 Battery", price: "₹999" },
        { id: 3, model: "F15", name: "Samsung F15 Battery", price: "₹1,199" },
      ],
      display: [
        { id: 1, model: "S20", name: "Samsung S20 Basic Display", price: "₹2,999" },
        { id: 2, model: "S20", name: "Samsung S20 Pro Display", price: "₹4,999" },
        { id: 3, model: "F14", name: "Samsung F14 Display", price: "₹1,999" },
      ],
    
    },
  },
  iphone: {
    name: "iPhone",
    parts: {
      battery: [
        { id: 1, model: "iPhone 12", name: "iPhone 12 Battery", price: "₹2,500" },
      ],
      display: [
        { id: 2, model: "iPhone 13", name: "iPhone 13 OLED Display", price: "₹5,500" },
      ],
    },
  },
};



export default function ModelDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const brand = modelData[name.toLowerCase()];

  if (!brand) return <h2>Brand not found</h2>;

  const partCategories = Object.keys(brand.parts);

  return (
    <div className=" min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header></Header>
        <div  className="flex justify-center pt-4">

        <SearchBar></SearchBar>
        </div>
  
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl  font-bold dark:text-white mb-6">
        {brand.name} Spare Parts
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {partCategories.map((partType) => (
          <div
            key={partType}
            onClick={() => navigate(`/models/${name}/${partType}`)}
            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold dark:text-white capitalize">
              {partType}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View all {partType} parts
            </p>
          </div>
        ))}
      </div>
    </div>
      </div>
  );
}