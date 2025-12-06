const Favorite = require("../models/Favorite");

exports.list = async (req, res, next) => {
  try {
    const favs = await Favorite.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(favs);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { recipeId, title, thumbnail, data } = req.body;
    if (!recipeId)
      return res.status(400).json({ message: "recipeId required" });
    const exists = await Favorite.findOne({ user: req.user.id, recipeId });
    if (exists) return res.status(400).json({ message: "Already favorited" });
    const fav = await Favorite.create({
      user: req.user.id,
      recipeId,
      title,
      thumbnail,
      data,
    });
    res.status(201).json(fav);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const found = await Favorite.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!found) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
