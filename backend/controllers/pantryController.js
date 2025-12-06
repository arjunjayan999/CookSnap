const PantryItem = require("../models/PantryItem");

exports.list = async (req, res, next) => {
  try {
    const items = await PantryItem.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, quantity, unit, meta } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const item = await PantryItem.create({
      user: req.user.id,
      name,
      quantity,
      unit,
      meta,
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await PantryItem.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await PantryItem.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

exports.clearAll = async (req, res, next) => {
  try {
    await PantryItem.deleteMany({ user: req.user.id });
    res.json({ message: "Cleared" });
  } catch (err) {
    next(err);
  }
};
