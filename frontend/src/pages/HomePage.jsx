import React from "react";
import ImageUploader from "../components/ImageUploader";

export default function HomePage() {
  return (
    <div className=" py-10 space-y-4">
      <h1 className="tracking-tight text-center text-4xl font-bold mb-4">
        Snap Ingredients, Get Recipes
      </h1>

      <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
        Upload photos of your ingredients, let AI recognize them, and discover{" "}
        delicious recipes you can make right now.
      </p>

      <ImageUploader />
    </div>
  );
}
