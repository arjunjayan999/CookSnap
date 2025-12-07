require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const passport = require("./config/passport");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const pantryRoutes = require("./routes/pantry");
const recipesRoutes = require("./routes/recipes");
const detectRoutes = require("./routes/detect");
const favoritesRoutes = require("./routes/favorites");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(passport.initialize());

connectDB();

app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/detect", detectRoutes);
app.use("/api/favorites", favoritesRoutes);

app.get("/", (req, res) =>
  res.json({ ok: true, message: "CookSnap backend running" })
);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
