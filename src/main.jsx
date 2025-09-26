import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import NoCopyProvider from "./components/userComponents/NoCopyProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <NoCopyProvider>
  <App />
  </NoCopyProvider>
    
  </BrowserRouter>
);
