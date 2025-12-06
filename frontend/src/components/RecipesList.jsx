import React, { useState } from "react";
import api from "../services/api";

import { Spinner } from "@/components/ui/spinner";
import ShoppingListModal from "../components/ShoppingListModal";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Heart, List } from "lucide-react";

export default function RecipesList({ recipes = [], onFavorite }) {
  const [expanded, setExpanded] = useState(null);
  const [modalItems, setModalItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stepsById, setStepsById] = useState({});
  const [loadingSteps, setLoadingSteps] = useState(null);

  const handleFavorite = async (r) => {
    try {
      const recipeId = r.id || r.recipeId || r.sourceId || r.title;
      await api.post("/api/favorites", {
        recipeId,
        title: r.title,
        thumbnail: r.thumbnail,
        data: r,
      });
      if (onFavorite) onFavorite(r);
      toast.success("Added to favorites!");
    } catch (err) {
      console.error("Fav error", err);

      if (err.response?.status === 401) {
        toast.warning("Login required", {
          description: "You need to sign in to save favorites.",
        });
      } else if (err.response?.status === 400) {
        toast.warning("Already in favorites", {
          description: "You've already added this recipe.",
        });
      } else {
        toast.error("Something went wrong", {
          description: "Could not save this recipe.",
        });
      }
    }
  };

  const openShopping = (r) => {
    const items =
      r.missedIngredients?.map((m) => m.original || m) ||
      r.missedIngredients ||
      [];
    setModalItems(items);
    setModalOpen(true);
  };

  const toggleSteps = async (r) => {
    const id = r.id || r.recipeId || r.sourceId;
    if (!id) {
      setExpanded(expanded === id ? null : id);
      return;
    }

    if (expanded === id) {
      setExpanded(null);
      return;
    }

    if (stepsById[id]) {
      setExpanded(id);
      return;
    }

    try {
      setLoadingSteps(id);
      const res = await api.get(
        `/api/recipes/${encodeURIComponent(id)}/instructions`
      );
      const instructions = (res.data && res.data.instructions) || [];
      setStepsById((s) => ({ ...s, [id]: instructions }));
      setExpanded(id);
    } catch (err) {
      console.error("Failed to load steps", err);
      toast.error("Failed to load steps", {
        description: "Unable to fetch recipe instructions.",
      });
    } finally {
      setLoadingSteps(null);
    }
  };

  return (
    <div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {recipes.map((r) => {
          const id = r.id || r.recipeId || r.sourceId;

          return (
            <Card
              key={id}
              className="break-inside-avoid-column mb-4 overflow-hidden flex flex-col"
            >
              {r.thumbnail && (
                <img
                  src={r.thumbnail}
                  alt=""
                  className="w-full h-40 object-cover"
                />
              )}

              <CardHeader>
                <div className="font-semibold text-lg">{r.title}</div>

                <div className="mt-1 text-sm text-muted-foreground">
                  <strong>In My Pantry:</strong>{" "}
                  {r.usedIngredients?.length ? (
                    <div className="mt-1 space-y-1">
                      {r.usedIngredients.map((u) => (
                        <div key={u.id}>{u.original}</div>
                      ))}
                    </div>
                  ) : (
                    "None"
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <strong>Missing:</strong>{" "}
                  {r.missedIngredientCount || r.missedIngredients?.length || 0}{" "}
                  ingredients
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {r.summary || r.description || ""}
                </p>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 mt-auto">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFavorite(r)}
                  >
                    <Heart />
                    Add to Favorites
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openShopping(r)}
                  >
                    <List />
                    Shopping List
                  </Button>
                </div>

                <Accordion
                  className="w-full"
                  type="single"
                  collapsible
                  value={expanded === id ? "steps" : ""}
                  onValueChange={(v) => {
                    if (v === "steps") toggleSteps(r);
                    else setExpanded(null);
                  }}
                >
                  <AccordionItem value="steps" className="border-none">
                    <AccordionTrigger className="text-primary px-0 hover:no-underline ">
                      {loadingSteps === id ? (
                        <div className="flex items-center gap-2">
                          <Spinner />
                          <span className="animate-pulse">Loading</span>
                        </div>
                      ) : expanded === id ? (
                        "Hide Steps"
                      ) : (
                        "Show Steps"
                      )}
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="text-sm text-muted-foreground mt-2">
                        {stepsById[id] && stepsById[id].length > 0 ? (
                          <ol className="list-decimal pl-5 space-y-1">
                            {stepsById[id]
                              .flatMap((inst) => inst.steps || [])
                              .map((s, i) => (
                                <li key={s.number || i}>{s.step || s}</li>
                              ))}
                          </ol>
                        ) : (
                          <div>No steps available</div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <ShoppingListModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        items={modalItems}
      />
    </div>
  );
}
