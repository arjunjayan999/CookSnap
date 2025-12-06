const express = require("express");
const router = express.Router();
const { getRecipes } = require("../controllers/recipesController");
const { getInstructions } = require("../controllers/recipesController");
const { optionalAuth } = require("../middleware/auth");

router.get("/", optionalAuth, getRecipes);
router.get("/:id/instructions", optionalAuth, getInstructions);

module.exports = router;
