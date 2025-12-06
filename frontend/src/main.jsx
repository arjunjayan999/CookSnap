import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { PantryProvider } from "./contexts/PantryContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PantryProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PantryProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
