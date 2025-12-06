import React from "react";
import { usePantry } from "../contexts/PantryContext";
import PantryList from "../components/PantryList";

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
      <div className="flex items-center justify-between mt-5">
        <h1 className="text-2xl font-semibold">My Pantry</h1>
        <div className="flex items-center gap-2">
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
      <div className="text-sm mt-3 text-muted-foreground">
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
    </div>
  );
}
