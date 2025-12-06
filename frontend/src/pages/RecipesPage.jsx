import React, { useEffect, useState } from "react";
import api from "../services/api";
import { usePantry } from "../contexts/PantryContext";
import RecipesList from "../components/RecipesList";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedItems } = usePantry();

  useEffect(() => {
    load();
  }, [selectedItems]);

  async function load() {
    try {
      setLoading(true);
      const selected = selectedItems() || [];
      const names = selected.map((p) => (p.name || "").trim()).filter(Boolean);
      if (names.length === 0) {
        setRecipes([]);
        return;
      }
      const q = `?ingredients=${encodeURIComponent(names.join(","))}`;
      const res = await api.get(`/api/recipes${q}`);
      setRecipes(res.data.recipes || res.data || []);
    } catch (err) {
      console.error("Failed to load recipes", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mt-4">Recipes</h1>
      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-base text-muted-foreground">
            Add or Select Items in your Pantry and Try Again.
          </div>
        ) : (
          <RecipesList recipes={recipes} />
        )}
      </div>
    </div>
  );
}
