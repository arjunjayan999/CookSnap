const express = require("express");
const router = express.Router();
const { detect } = require("../controllers/detectController");

router.post("/", detect);

module.exports = router;
