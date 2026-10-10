import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CreateProductPage from "./pages/CreateProductPage.jsx";
import "./styles/app.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CreateProductPage />
    </BrowserRouter>
  </StrictMode>,
);
