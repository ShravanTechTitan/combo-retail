import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Home from "./pages/Home.jsx";
import DashboardLayout from "./pages/DashbordPages/DashboardLayout.jsx";
import Combos from "./pages/DashbordPages/Combos.jsx";
import Mobiles from "./pages/Mobiles.jsx";
import Subscriptions from "./pages/DashbordPages/Subscriptions.jsx";
import Login from "./pages/Login.jsx";
import ModelPage from "./pages/ModelPage.jsx";
import DeviceCategories from "./pages/DashbordPages/DeviceCategories.jsx";
import PartCategories from "./pages/DashbordPages/PartCategories.jsx";
import Products from "./pages/DashbordPages/Products.jsx";
import BrandPage from "./pages/DashbordPages/BrandPage.jsx";
import Model from "./pages/DashbordPages/ModelPage.jsx";
import ModelDetails from "./pages/userpages/ModelDetails.jsx";
import PartDetails from "./pages/userpages/PartDetails.jsx";
import ProductPage from "./pages/userpages/ProductPage.jsx";
import AdminDashboard from "./pages/DashbordPages/AdminDashboard.jsx";
import Subscribe from "./pages/userpages/Subscribe.jsx";
import AdminSubscriptions from "./pages/DashbordPages/AdminSubscriptions.jsx";
import Blogs from "./pages/DashbordPages/Blogs.jsx";
import BlogPage from "./pages/userpages/BlogPage.jsx";
import BlogDetailPage from "./pages/userpages/BlogDetailPage.jsx";
import Analytics from "./pages/DashbordPages/Analytics.jsx";
import ActivityLogs from "./pages/DashbordPages/ActivityLogs.jsx";
import Notifications from "./pages/DashbordPages/Notifications.jsx";
import AdvancedSearch from "./pages/userpages/AdvancedSearch.jsx";
import Contact from "./pages/userpages/Contact.jsx";
import UserProfile from "./pages/userpages/Profile.jsx";
import ProtectedRoute from "./components/userComponents/ProtectedRoute.jsx";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const darkMode = localStorage.getItem("theme") === "dark";
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

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
     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
    <Routes>
      <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="adminDashboard" element={<AdminDashboard></AdminDashboard>}></Route>
        <Route path="analytics" element={<Analytics />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="deviceCategories" element={<DeviceCategories/>}></Route>
        <Route path="partCategories" element={<PartCategories/>}></Route>
        <Route path="BrandPage" element={<BrandPage></BrandPage>}/>
        <Route path="ModelPage" element={<Model></Model>}/>
        <Route path="Products" element={<Products></Products>}/>
        <Route path="combos" element={<Combos />} />
        <Route path="mobiles" element={<Mobiles />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="AdminSubscriptions" element={<AdminSubscriptions></AdminSubscriptions>}/>
        <Route path="blogs" element={<Blogs />} />
      </Route>
        <Route path="/combo/:id/:modelId" element={<ModelPage />} /> {/* Level 3 */}
        <Route path="/models/:brand/:brandId" element={<ModelDetails />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/search" element={<AdvancedSearch />} />
         <Route path="/contact" element={<Contact />} />
        <Route path="/models/:brand/:brandId/:partCategoryName/:partCategoryId" element={ <ProtectedRoute user={user} ><PartDetails /></ProtectedRoute>} />
         <Route path="/product/:id" element={ <ProtectedRoute user={user} ><ProductPage /></ProtectedRoute>} />
         <Route path="/subscribe" element={<Subscribe></Subscribe>} />
         <Route path="/profile" element={<UserProfile></UserProfile>}/>
    </Routes>
    </div>
  );
}

export default App;
