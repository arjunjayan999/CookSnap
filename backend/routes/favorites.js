const express = require("express");
const router = express.Router();
const favorites = require("../controllers/favoritesController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", favorites.list);
router.post("/", favorites.create);
router.delete("/:id", favorites.remove);

module.exports = router;
