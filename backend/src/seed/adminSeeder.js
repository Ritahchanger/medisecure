const mongoose = require("mongoose");

const User = require("../models/User");

require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", existingAdmin.email);
      process.exit(0);
    }
    const admin = new User({
      name: "System Admin",
      email: "admin@medisecure.com",
      password: "Admin@12345",
      role: "admin",
    });

    await admin.save();

    console.log("✅ Admin user created successfully:");
    console.log("   Email: admin@medisecure.com");
    console.log("   Password: Admin@12345");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed admin:", error);
    process.exit(1);
  }
}

seedAdmin();
