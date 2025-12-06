import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/api";
import IngredientConfirmModal from "./IngredientConfirmModal";
import { usePantry } from "../contexts/PantryContext";

import { toast } from "sonner";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Info, Scan, Trash2, Upload } from "lucide-react";

export default function ImageUploader({ onUpload }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const imgRef = useRef(null);
  const inputRef = useRef(null);
  const pantryContext = usePantry();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = useCallback(
    (f) => {
      if (!f) return;
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      setFile(f);
      if (onUpload) onUpload(f);
    },
    [onUpload]
  );

  const onInputChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) handleFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const analyzeImage = async () => {
    if (!file)
      return toast.warning("No image selected", {
        description: "Please upload an image before analyzing.",
      });

    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await api.post("/api/detect", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      let data = res.data;
      if (data && data.detections) data = data.detections;
      if (!Array.isArray(data)) data = [];

      setDetections(
        data.map((d, i) => ({
          id: i,
          label: d.label || d.name || "",
          confidence: d.confidence || d.conf || 0,
          bbox: d.bbox || d.box || {},
        }))
      );
      setShowModal(true);
    } catch (err) {
      console.error("Detect error", err);
      toast.error("AI failed to detect ingredients", {
        description:
          err.response?.data?.message ||
          "Try a clearer image with better lighting.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = async (itemsToSave) => {
    const selected = itemsToSave.filter((i) => i.addToPantry);
    if (!selected.length) {
      setShowModal(false);
      return;
    }
    const { addItem } = pantryContext;
    try {
      for (const it of selected) {
        await addItem({
          name: it.label,
          quantity:
            typeof it.quantity === "number"
              ? it.quantity
              : it.quantity
              ? Number(it.quantity)
              : 1,
          unit: it.unit || "",
          meta: { confidence: it.confidence, bbox: it.bbox },
        });
      }
      toast.success("Items saved!", {
        description: "Selected ingredients were added to your pantry.",
      });
    } catch (err) {
      console.error("Save via pantry context failed", err);
      toast.error("Failed to save ingredients", {
        description: "Unable to save items to the pantry.",
      });
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <Card className="border shadow-sm space-y-4">
        <CardHeader>
          <h2 className="font-semibold text-lg">Upload Ingredient Photo</h2>
          <p className="text-sm text-muted-foreground">
            Take a photo or upload an image of your ingredients to get recipe
            suggestions
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div
            className={`border-2 rounded-lg p-6 text-center transition ${
              dragOver
                ? "border-primary bg-primary/10"
                : "border-dashed border-muted-foreground/40"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            {previewUrl ? (
              <div className="mt-4 flex justify-center">
                <img
                  ref={imgRef}
                  src={previewUrl}
                  alt="preview"
                  className="max-w-full rounded-lg shadow-sm"
                />
              </div>
            ) : (
              <>
                <Upload className="w-full size-12 text-muted-foreground mb-3" />
                <div className=" text-lg font-medium">
                  Drag & Drop your image here
                </div>
                <div className="text-sm text-muted-foreground pb-2 mb-2">
                  or click to browse
                </div>
              </>
            )}

            <Input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onInputChange}
              className="hidden mt-4 cursor-pointer "
            />
            <Button
              className="mt-4"
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <Upload />
              Upload Image
            </Button>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              disabled={!file || loading}
              onClick={analyzeImage}
              className=""
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4" />{" "}
                  <span className="animate-pulse">Analyzing</span>
                </>
              ) : (
                <>
                  <Scan />
                  Analyze Image
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setDetections([]);
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
            >
              <Trash2 />
              Clear
            </Button>
          </div>

          {showModal && (
            <IngredientConfirmModal
              imageUrl={previewUrl}
              detections={detections}
              onCancel={() => setShowModal(false)}
              onConfirm={onConfirm}
            />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info color="#3b82f6" />
            <span>Tips for Better Recognition</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Ensure good lighting and clear focus</li>
            <li>• Place ingredients on a plain background</li>
            <li>• Capture individual ingredients separately</li>
            <li>• Avoid cluttered images with multiple items</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
