const express = require("express");
const router = express.Router();
const pantry = require("../controllers/pantryController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", pantry.list);
router.post("/", pantry.create);
router.put("/:id", pantry.update);
router.delete("/:id", pantry.remove);
router.delete("/", pantry.clearAll);

module.exports = router;
