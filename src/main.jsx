import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Temporarily disable HelmetProvider due to React 19 compatibility issues
// import { HelmetProvider } from "react-helmet-async";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      {/* Temporarily disabled HelmetProvider due to React 19 compatibility */}
      {/* <HelmetProvider> */}
      <App />
      {/* </HelmetProvider> */}
    </BrowserRouter>
  </StrictMode>
);
