const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sourceUrl: { type: String },
  thumbnail: { type: String },
  ingredients: { type: Array, default: [] },
  steps: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
