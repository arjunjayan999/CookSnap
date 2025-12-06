require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/cooksnap";

async function main() {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to mongo for seeding");

  const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "password123";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin user already exists:", email);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash, name: "Admin" });
  console.log("Created admin user:", user.email);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
