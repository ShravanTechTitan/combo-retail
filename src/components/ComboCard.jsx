import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

export default function ComboCard({ combo }) {
  const navigate = useNavigate();

  const handleViewClick = () => {
    if (!isLoggedIn()) {
      navigate("/login");
    } else {
      navigate(`/combo/${combo.id}`); // combo ki ID ke sath redirect
    }
  };

  return (
    <div className="border rounded-xl p-4 mt-2 shadow-md bg-green-200 dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{combo.name}</h2>
      <p className="text-gray-500 dark:text-gray-400">Price: {combo.price}</p>
      <p className="text-gray-500 dark:text-gray-400">Duration: {combo.duration}</p>

      <button
        onClick={handleViewClick}
        className="mt-3 cursor-pointer primery-btn bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        View Models
      </button>
    </div>
  );
}
