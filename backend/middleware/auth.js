const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.requireAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      photo: user.photo,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.optionalAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return next();
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    const user = await User.findById(decoded.id).select("-password");
    if (user)
      req.user = {
        id: user._id,
        email: user.email,
        name: user.name,
        photo: user.photo,
      };
  } catch (err) {}
  next();
};
