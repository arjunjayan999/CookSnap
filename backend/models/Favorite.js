const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: Number, required: true },
  title: { type: String },
  thumbnail: { type: String },
  data: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
