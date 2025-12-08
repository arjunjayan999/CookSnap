import React from "react";
import { usePantry } from "../contexts/PantryContext";
import PantryList from "../components/PantryList";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import PantryListSkeleton from "@/components/PantryListSkeleton";
import { Copy, FileSpreadsheet, Trash2 } from "lucide-react";

export default function PantryPage() {
  const { items, loading, clearAll, exportCSV } = usePantry();

  const copyPantryPlain = async () => {
    const names = (items || []).map((p) => p.name || "").filter(Boolean);
    const text = names.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Pantry copied to clipboard!");
    } catch (e) {
      console.warn("Clipboard failed", e);
      toast.error("Clipboard error", {
        description: "Could not copy text to clipboard.",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
        <h1 className="text-2xl font-semibold text-center">My Pantry</h1>
        <div className="flex items-center justify-center gap-2">
          <Button onClick={exportCSV} variant="outline">
            <FileSpreadsheet />
            Export CSV
          </Button>
          <Button onClick={copyPantryPlain} variant="outline">
            <Copy />
            Copy pantry
          </Button>
          <Button onClick={clearAll} variant="destructive">
            <Trash2 />
            Clear All
          </Button>
        </div>
      </div>
      <div className="text-sm mt-3 text-muted-foreground text-center sm:text-left">
        Select the ingredients you'd like to get recipe suggestions for.
      </div>
      <div className="mt-8">
        {loading ? (
          <PantryListSkeleton count={items.length || 1} />
        ) : items.length === 0 ? (
          <div className=" text-muted-foreground text-base">
            Your pantry is empty. Let's fill it up!
          </div>
        ) : (
          <PantryList />
        )}
      </div>
      <Link to="/recipes" className="flex justify-end mt-3">
        <Button
          variant="secondary"
          className="bg-primary text-secondary transition-colors duration-300 ease-in-out hover:bg-secondary hover:text-primary"
        >
          Search Recipes
        </Button>
      </Link>
    </div>
  );
}
