import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CatalogPage from "./pages/CatalogPage.jsx";
import "./styles/app.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CatalogPage />
  </StrictMode>,
);
