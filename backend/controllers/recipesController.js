const { fetchRecipesByIngredients } = require("../utils/spoonacular");
const PantryItem = require("../models/PantryItem");
const { fetchAnalyzedInstructions } = require("../utils/spoonacular");

exports.getRecipes = async (req, res, next) => {
  try {
    let ingredients = [];
    if (req.query.ingredients) {
      ingredients = req.query.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (req.user) {
      const items = await PantryItem.find({ user: req.user.id });
      ingredients = items.map((i) => i.name);
    } else {
      return res.status(400).json({ message: "No ingredients provided" });
    }

    const recipes = await fetchRecipesByIngredients(ingredients);
    res.json({ ingredients, recipes });
  } catch (err) {
    next(err);
  }
};

exports.getInstructions = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing recipe id" });
    const instructions = await fetchAnalyzedInstructions(id);
    res.json({ id, instructions });
  } catch (err) {
    next(err);
  }
};
