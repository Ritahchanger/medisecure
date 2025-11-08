const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // -------------------------------
    // ✅ Seed Admin
    // -------------------------------
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const admin = new User({
        name: "System Admin",
        email: "admin@medisecure.com",
        password: "Admin@12345",
        role: "admin",
      });

      await admin.save();
      console.log("✅ Admin created: admin@medisecure.com / Admin@12345");
    } else {
      console.log("⚠️ Admin already exists:", existingAdmin.email);
    }

    // -------------------------------
    // ✅ Seed Doctor
    // -------------------------------
    const existingDoctor = await User.findOne({ role: "doctor" });
    if (!existingDoctor) {
      const doctor = new User({
        name: "Dr. John Doe",
        email: "doctor@medisecure.com",
        password: "Doctor@12345",
        role: "doctor",
      });

      await doctor.save();
      console.log("✅ Doctor created: doctor@medisecure.com / Doctor@12345");
    } else {
      console.log("⚠️ Doctor already exists:", existingDoctor.email);
    }

    // -------------------------------
    // ✅ Seed Nurse
    // -------------------------------
    const existingNurse = await User.findOne({ role: "nurse" });
    if (!existingNurse) {
      const nurse = new User({
        name: "Nurse Grace Wanjiru",
        email: "nurse@medisecure.com",
        password: "Nurse@12345",
        role: "nurse",
      });

      await nurse.save();
      console.log("✅ Nurse created: nurse@medisecure.com / Nurse@12345");
    } else {
      console.log("⚠️ Nurse already exists:", existingNurse.email);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed users:", error);
    process.exit(1);
  }
}

seedUsers();
