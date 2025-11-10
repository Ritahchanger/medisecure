const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  deleteDoctor,
  searchDoctors,
  getDoctorsStats,
} = require("../controllers/doctors.controller");

// @route   GET /api/doctors
// @desc    Get all doctors with pagination
// @access  Private/Admin
router.get("/", getDoctors);

// @route   GET /api/doctors/stats
// @desc    Get doctors 
// @access  Private/Admin
router.get("/stats", getDoctorsStats);

// @route   GET /api/doctors/search
// @desc    Search doctors by name or email
// @access  Private/Admin
router.get("/search", searchDoctors);

// @route   GET /api/doctors/:id
// @desc    Get single doctor by ID
// @access  Private/Admin
router.get("/:id", getDoctorById);

// @route   DELETE /api/doctors/:id
// @desc    Delete a doctor
// @access  Private/Admin
router.delete("/:id", deleteDoctor);

module.exports = router;
