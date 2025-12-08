import React, { useState } from "react";
import { usePantry } from "../contexts/PantryContext";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { CircleX, Edit, Save, Trash2 } from "lucide-react";

export default function PantryList() {
  const { items, updateItem, deleteItem, toggleSelect, isSelected } =
    usePantry();
  const [editing, setEditing] = useState(null);
  const [nameVal, setNameVal] = useState("");
  const [quantityVal, setQuantityVal] = useState("");
  const [unitVal, setUnitVal] = useState("");

  function startEdit(idx, it) {
    setEditing(idx);
    setNameVal(it.name || "");
    setQuantityVal(it.quantity != null ? String(it.quantity) : "");
    setUnitVal(it.unit || "");
  }

  async function saveEdit(idx, it) {
    const payload = {
      name: nameVal,
      quantity: quantityVal === "" ? undefined : Number(quantityVal),
      unit: unitVal || undefined,
    };
    await updateItem(it._id || idx, payload);
    setEditing(null);
  }

  return (
    <div className="space-y-2">
      {items.map((it, idx) => (
        <div
          key={it._id || idx}
          className="flex items-center gap-3 border rounded-md p-3"
        >
          <Checkbox
            checked={isSelected(it)}
            onCheckedChange={() => toggleSelect(it)}
          />

          <Badge variant="secondary" className="px-2 py-1">
            {it.quantity != null ? it.quantity : 1}
            {it.unit ? ` ${it.unit}` : ""}
          </Badge>

          <div className="flex-1">
            {editing === idx ? (
              <div className="space-y-2">
                <Input
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  placeholder="Enter Ingredient Name"
                  required
                />

                <div className="flex gap-2">
                  <Input
                    type="number"
                    className="min-w-8"
                    value={quantityVal}
                    onChange={(e) => setQuantityVal(e.target.value)}
                    min="1"
                    step="any"
                    required
                  />

                  <Select value={unitVal} onValueChange={setUnitVal}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Unit (g, cup, pcs …)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>

                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="l">l</SelectItem>
                      <SelectItem value="tsp">tsp</SelectItem>
                      <SelectItem value="tbsp">tbsp</SelectItem>
                      <SelectItem value="cup">cup</SelectItem>
                      <SelectItem value="pint">pint</SelectItem>
                      <SelectItem value="quart">quart</SelectItem>
                      <SelectItem value="gallon">gallon</SelectItem>

                      <SelectItem value="pcs">pcs</SelectItem>
                      <SelectItem value="piece">piece</SelectItem>
                      <SelectItem value="clove">clove</SelectItem>
                      <SelectItem value="slice">slice</SelectItem>
                      <SelectItem value="stick">stick</SelectItem>

                      <SelectItem value="bunch">bunch</SelectItem>
                      <SelectItem value="head">head</SelectItem>
                      <SelectItem value="leaf">leaf</SelectItem>
                      <SelectItem value="sprig">sprig</SelectItem>

                      <SelectItem value="pinch">pinch</SelectItem>
                      <SelectItem value="dash">dash</SelectItem>
                      <SelectItem value="drop">drop</SelectItem>

                      <SelectItem value="can">can</SelectItem>
                      <SelectItem value="jar">jar</SelectItem>
                      <SelectItem value="bottle">bottle</SelectItem>
                      <SelectItem value="pack">pack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="font-medium text-foreground">{it.name}</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {editing === idx ? (
              <div className="flex flex-col gap-3">
                <Button className="w-fit" onClick={() => saveEdit(idx, it)}>
                  <Save />
                  <span className=" hidden sm:inline">Save</span>
                </Button>
                <Button
                  className="w-fit"
                  variant="outline"
                  onClick={() => setEditing(null)}
                >
                  <CircleX />
                  <span className="hidden sm:inline">Cancel</span>
                </Button>
              </div>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(idx, it)}
                >
                  <Edit />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteItem(it._id || idx)}
                >
                  <Trash2 />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
