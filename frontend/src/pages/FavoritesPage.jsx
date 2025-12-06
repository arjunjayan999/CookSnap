import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import FavoritesListSkeleton from "../components/FavoritesListSkeleton";
import ShoppingListModal from "../components/ShoppingListModal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

import { toast } from "sonner";
import { List, Trash2 } from "lucide-react";

export default function FavoritesPage() {
  const [favs, setFavs] = useState([]);
  const { user } = useAuth() || {};
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [user]);

  async function load() {
    setLoading(true);
    if (!user) {
      setFavs([]);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/api/favorites");
      setFavs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/api/favorites/${id}`);
      setFavs((prev) => prev.filter((f) => f._id !== id));
      toast.success("Removed from favorites");
    } catch (err) {
      console.error(err);
    }
  }

  const openShopping = (fav) => {
    const src = fav.data || {};
    const items =
      src.missedIngredients?.map((m) => m.original || m) ||
      src.missedIngredients ||
      [];
    setModalItems(items);
    setModalOpen(true);
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-semibold">Favorites</h1>
      <div className="mt-4 space-y-3">
        {loading && <FavoritesListSkeleton count={favs.length || 1} />}
        {!loading && favs.length === 0 && (
          <div className="text-sm text-muted-foreground">
            You haven’t added any favorites yet.
          </div>
        )}

        {!loading &&
          favs.map((f) => (
            <Card className="mt-8" key={f._id || f.recipeId}>
              <CardHeader>
                <div className="font-medium text-lg">{f.title}</div>
              </CardHeader>

              <CardFooter className="flex justify-between items-center">
                <div></div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openShopping(f)}
                  >
                    <List />
                    Shopping List
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(f._id)}
                  >
                    <Trash2 />
                    Remove
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>

      <ShoppingListModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        items={modalItems}
      />
    </div>
  );
}
