import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import NoCopyProvider from "./components/userComponents/NoCopyProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <HelmetProvider>
  <NoCopyProvider>
  <App />
  </NoCopyProvider>
  </HelmetProvider>
    
  </BrowserRouter>
);
