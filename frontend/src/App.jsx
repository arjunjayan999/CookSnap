import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PantryPage from "./pages/PantryPage";
import RecipesPage from "./pages/RecipesPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import OAuthSuccess from "./pages/Auth/OAuthSuccess";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="pantry" element={<PantryPage />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="oauth-success" element={<OAuthSuccess />} />
      </Route>
    </Routes>
  );
}
