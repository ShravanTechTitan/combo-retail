import { Routes, Route, Router } from "react-router-dom";
import Home from "./pages/Home.jsx";
import DashboardLayout from "./pages/DashbordPages/DashboardLayout.jsx";
import Combos from "./pages/DashbordPages/Combos.jsx";
import Mobiles from "./pages/Mobiles.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Login from "./pages/Login.jsx";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import ModelPage from "./pages/ModelPage.jsx";
import DeviceCategories from "./pages/DashbordPages/DeviceCategories.jsx";
import PartCategories from "./pages/DashbordPages/PartCategories.jsx";

import Products from "./pages/DashbordPages/Products.jsx";
import BrandPage from "./pages/DashbordPages/BrandPage.jsx";
import Model from "./pages/DashbordPages/ModelPage.jsx";
import ModelDetails from "./pages/userpages/ModelDetails.jsx";
import PartDetails from "./pages/userpages/PartDetails.jsx";
import ProductPage from "./pages/userpages/ProductPage.jsx";

// App.jsx


function App() {


  const [user, setUser] = useState(null);
  useEffect(() => {


    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  return (
     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <Routes>
      <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="deviceCategories" element={<DeviceCategories/>}></Route>
        <Route path="partCategories" element={<PartCategories/>}></Route>
        <Route path="BrandPage" element={<BrandPage></BrandPage>}/>
        <Route path="ModelPage" element={<Model></Model>}/>
        <Route path="Products" element={<Products></Products>}/>
        <Route path="combos" element={<Combos />} />
        <Route path="mobiles" element={<Mobiles />} />
        <Route path="subscriptions" element={<Subscriptions />} />
      </Route>
        <Route path="/combo/:id/:modelId" element={<ModelPage />} /> {/* Level 3 */}
        <Route path="/models/:brand/:brandId" element={<ModelDetails />} />
        <Route path="/models/:brand/:brandId/:partCategoryName/:partCategoryId" element={<PartDetails />} />
         <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
    </div>
  );
}

export default App;
