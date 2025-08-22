import { Routes, Route, Router } from "react-router-dom";
import Home from "./pages/Home.jsx";
import DashboardLayout from "./pages/DashbordPages/DashboardLayout.jsx";
import Combos from "./pages/DashbordPages/Combos.jsx";
import ComboPage from "./pages/ComboPage.jsx";
import Mobiles from "./pages/Mobiles.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Login from "./pages/Login.jsx";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import ModelPage from "./pages/ModelPage.jsx";
import Categories from "./pages/DashbordPages/Categories.jsx";

import Products from "./pages/DashbordPages/Products.jsx";
import BrandPage from "./pages/DashbordPages/BrandPage.jsx";
import Model from "./pages/DashbordPages/ModelPage.jsx";
import ModelDetails from "./pages/userpages/ModelDetails.jsx";
import PartDetails from "./pages/userpages/PartDetails.jsx";

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
    <Routes>
      <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="categories" element={<Categories/>}></Route>
        <Route path="BrandPage" element={<BrandPage></BrandPage>}/>
        <Route path="ModelPage" element={<Model></Model>}/>
        <Route path="Products" element={<Products></Products>}/>
        <Route path="combos" element={<Combos />} />
        <Route path="mobiles" element={<Mobiles />} />
        <Route path="subscriptions" element={<Subscriptions />} />
      </Route>
        <Route path="/combo/:id" element={<ComboPage />} /> {/* Level 2 */}
        <Route path="/combo/:id/:modelId" element={<ModelPage />} /> {/* Level 3 */}
        <Route path="/models/:name" element={<ModelDetails />} />
        <Route path="/models/:brand/:partType" element={<PartDetails />} />
    </Routes>
  );
}

export default App;
