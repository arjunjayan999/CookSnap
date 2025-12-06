const mongoose = require("mongoose");

const PantryItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: "" },
  meta: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PantryItem", PantryItemSchema);
