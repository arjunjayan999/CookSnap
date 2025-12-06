const axios = require("axios");

const MOCK_RECIPES = [
  {
    id: 0,
    title: "Mock Omelette",
    thumbnail:
      "https://www.healthyfood.com/wp-content/uploads/2018/02/Basic-omelette-1024x656.jpg",
    missingIngredients: [],
    steps: ["Beat eggs", "Cook in pan"],
  },
];

async function fetchRecipesByIngredients(ingredients = []) {
  const key = process.env.SPOONACULAR_API_KEY;
  if (!key) {
    return MOCK_RECIPES;
  }

  try {
    const q = ingredients.join(",");
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
      q
    )}&number=9&apiKey=${key}`;
    const r = await axios.get(url, { timeout: 10000 });
    const results = r.data.map((item) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.image,
      usedIngredientCount: item.usedIngredientCount,
      usedIngredients: item.usedIngredients,
      missedIngredientCount: item.missedIngredientCount,
      missedIngredients: item.missedIngredients,
    }));
    return results;
  } catch (err) {
    console.warn("Spoonacular request failed, returning mock", err.message);
    return MOCK_RECIPES;
  }
}

module.exports = { fetchRecipesByIngredients };

async function fetchAnalyzedInstructions(id) {
  const key = process.env.SPOONACULAR_API_KEY;
  if (!key) {
    return [
      {
        name: "",
        steps: [
          { number: 1, step: "Mock step 1" },
          { number: 2, step: "Mock step 2" },
        ],
      },
    ];
  }
  try {
    const url = `https://api.spoonacular.com/recipes/${encodeURIComponent(
      id
    )}/analyzedInstructions?apiKey=${key}`;
    const r = await require("axios").get(url, { timeout: 10000 });
    return Array.isArray(r.data) ? r.data : [];
  } catch (err) {
    console.warn("Failed to fetch analyzedInstructions", err.message);
    return [];
  }
}

module.exports.fetchAnalyzedInstructions = fetchAnalyzedInstructions;
