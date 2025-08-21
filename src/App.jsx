import { Routes, Route, Router } from "react-router-dom";
import Home from "./pages/Home";
import DashboardLayout from "./pages/DashbordPages/DashboardLayout";
import Combos from "./pages/DashbordPages/Combos";
import ComboPage from "./pages/ComboPage";
import Mobiles from "./pages/Mobiles";
import Subscriptions from "./pages/Subscriptions";
import Login from "./pages/login";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import ModelPage from "./pages/ModelPage";
import Categories from "./pages/DashbordPages/Categories";

import Products from "./pages/DashbordPages/Products";
import BrandPage from "./pages/DashbordPages/BrandPage";
import Model from "./pages/DashbordPages/ModelPage";
import ModelDetails from "./pages/userpages/ModelDetails";
import PartDetails from "./pages/userpages/PartDetails";

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
