import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";

function cropImageDataUrl(imageUrl, bbox) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      let { x, y, w, h } = bbox || {};
      if (!x && x !== 0) {
        resolve(null);
        return;
      }
      if (x <= 1 && w <= 1) {
        x = x * iw;
        y = y * ih;
        w = w * iw;
        h = h * ih;
      }

      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        Math.round(x),
        Math.round(y),
        Math.round(w),
        Math.round(h),
        0,
        0,
        canvas.width,
        canvas.height
      );
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

export default function IngredientConfirmModal({
  imageUrl,
  detections = [],
  onCancel,
  onConfirm,
}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function prepare() {
      const map = {};

      for (const d of detections) {
        const name = d.label
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const crop = await cropImageDataUrl(imageUrl, d.bbox || {});

        if (!map[name]) {
          map[name] = {
            ...d,
            name,
            crop,
            quantity: 1,
            unit: "",
            addToPantry: d.confidence > 0.6,
            confidence: d.confidence,
          };
        } else {
          map[name].quantity += 1;

          map[name].confidence = Math.max(map[name].confidence, d.confidence);
        }
      }

      const mergedList = Object.values(map);

      if (mounted) setItems(mergedList);
    }

    prepare();
    return () => {
      mounted = false;
    };
  }, [detections, imageUrl]);

  function toggleAdd(idx) {
    setItems((s) =>
      s.map((it, i) =>
        i === idx ? { ...it, addToPantry: !it.addToPantry } : it
      )
    );
  }

  function updateName(idx, val) {
    setItems((s) => s.map((it, i) => (i === idx ? { ...it, name: val } : it)));
  }

  function updateQuantity(idx, val) {
    const n = Math.max(1, Math.floor(Number(val) || 1));
    setItems((s) =>
      s.map((it, i) => (i === idx ? { ...it, quantity: n } : it))
    );
  }

  function updateUnit(idx, val) {
    setItems((s) => s.map((it, i) => (i === idx ? { ...it, unit: val } : it)));
  }

  function confirm() {
    const payload = items.map((it) => ({
      label: it.name || it.label,
      confidence: it.confidence,
      bbox: it.bbox,
      addToPantry: !!it.addToPantry,
      quantity:
        typeof it.quantity === "number"
          ? it.quantity
          : it.quantity
          ? Number(it.quantity)
          : 1,
      unit: it.unit || "",
    }));
    onConfirm && onConfirm(payload);
  }

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-4">
        <DialogHeader>
          {items.length !== 0 ? (
            <>
              <DialogTitle>Verify Ingredients Before Saving</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Edit ingredient details before saving them to your pantry.
              </p>
            </>
          ) : (
            <DialogTitle>We Can't See the Food!</DialogTitle>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {items.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No items found. Please upload a clearer image.
            </div>
          )}

          <div className="space-y-3 mt-2">
            {items.map((it, idx) => {
              const low = (it.confidence || 0) < 0.6;

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 shadow-sm hover:shadow-md bg-card transition duration-200 ease-in hover:text-foreground${
                    low
                      ? " border-l-4 border-destructive bg-destructive/10"
                      : ""
                  }`}
                >
                  <div className="w-24 h-24 bg-muted flex items-center justify-center overflow-hidden rounded">
                    {it.crop ? (
                      <img
                        src={it.crop}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Preview unavailable
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        autoFocus={low}
                        placeholder="Enter Ingredient Name"
                        value={it.name}
                        onChange={(e) => updateName(idx, e.target.value)}
                        className="flex-1 "
                        required
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-20 h-1 bg-muted rounded">
                          <div
                            className={
                              low
                                ? `h-1 rounded bg-destructive`
                                : `h-1 rounded bg-primary`
                            }
                            style={{
                              width: `${Math.round(
                                (it.confidence || 0) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs">
                          {Math.round((it.confidence || 0) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm">Quantity</label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        className="w-20"
                        value={it.quantity}
                        onChange={(e) => updateQuantity(idx, e.target.value)}
                      />
                      <Select
                        value={it.unit}
                        onValueChange={(val) => updateUnit(idx, val)}
                      >
                        <SelectTrigger className="w-full h-9">
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

                    {low && (
                      <div className="text-xs font-medium text-destructive">
                        <AlertTriangle size={18} className="inline mr-2" />
                        Low Confidence — Please Verify or Correct the Label.
                      </div>
                    )}

                    <div className="flex items-center justify-end pt-2 gap-3">
                      <span className="text-sm font-medium tracking-tight">
                        Save to My Pantry
                      </span>

                      <Switch
                        className="data-[state=unchecked]:bg-foreground/50"
                        checked={!!it.addToPantry}
                        onCheckedChange={() => toggleAdd(idx)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-2 flex items-center">
          <Button variant="outline" onClick={onCancel}>
            Dismiss
          </Button>
          {items.length !== 0 && (
            <Button size="lg" onClick={confirm}>
              Confirm & Save Items
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
