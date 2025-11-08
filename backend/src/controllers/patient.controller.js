// controllers/patient.controller.js
const patientService = require("../services/patient.service");

/**
 * @desc Create new patient record
 * @route POST /api/patients
 * @access Protected (doctor, nurse, admin)
 * Accepts multiple files: req.files
 */

exports.getAllConditions = async (req, res) => {
  console.log("📋 Fetching all unique conditions");

  const conditions = await patientService.getAllUniqueConditions();

  return res.status(200).json({
    success: true,
    count: conditions.length,
    data: conditions,
  });
};

exports.createPatient = async (req, res) => {
  console.log("=== CREATE PATIENT CONTROLLER ===");
  console.log("📥 Request body keys:", Object.keys(req.body));
  console.log("📁 Files received:", req.files ? req.files.length : 0);

  if (req.files) {
    req.files.forEach((file, index) => {
      console.log(`📄 File ${index + 1}:`, file.originalname);
    });
  }

  // Check if patientData exists
  if (!req.body.patientData) {
    console.log("❌ patientData is missing from request");
    return res.status(400).json({
      success: false,
      message: "patientData is required in the request body",
    });
  }

  console.log("📋 Raw patientData:", req.body.patientData);

  // Parse the patientData
  let patientData;
  try {
    patientData = JSON.parse(req.body.patientData);
    console.log("✅ Successfully parsed patientData:", patientData);
  } catch (parseError) {
    console.log("❌ JSON parse error:", parseError.message);
    return res.status(400).json({
      success: false,
      message: "Invalid patientData JSON format: " + parseError.message,
    });
  }

  // Validate required fields
  if (!patientData.name || !patientData.dob || !patientData.encryptedData) {
    console.log("❌ Missing required fields in patientData");
    return res.status(400).json({
      success: false,
      message: "Name, DOB, and encryptedData are required fields",
    });
  }

  console.log("👤 User from auth:", req.user);
  console.log("📁 Files to process:", req.files ? req.files.length : 0);

  // Call the service with the correct parameters
  console.log("🔄 Calling patientService.createPatient...");
  const result = await patientService.createPatient(
    req.user,
    patientData,
    req.files || []
  );

  console.log("✅ Patient created successfully:", result.patientId);

  res.status(201).json({
    success: true,
    message: "Patient created successfully",
    data: result,
  });
};

/**
 * @desc Get all patients (with decrypted data)
 * @route GET /api/patients
 * @access Protected
 */
exports.getAllPatients = async (req, res) => {
  const user = req.user;
  const patients = await patientService.getAllPatients(user);

  return res.status(200).json({
    success: true,
    count: patients.length,
    data: patients,
  });
};

/**
 * @desc Get single patient by ID (decrypted)
 * @route GET /api/patients/:id
 * @access Protected
 */
exports.getPatientById = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  const patient = await patientService.getPatientById(user, id);

  return res.status(200).json({
    success: true,
    data: patient,
  });
};

/**
 * @desc Global stats (conditions, counts)
 * @route GET /api/patients/stats/global
 * @access Protected
 */
exports.getPatientStats = async (req, res) => {
  const stats = await patientService.getPatientStats();

  return res.status(200).json({
    success: true,
    stats,
  });
};

/**
 * @desc Find similar patient cases
 * @route GET /api/patients/similar/:id
 * @access Protected
 */
exports.getSimilarPatients = async (req, res) => {
  const { id } = req.params;
  const similar = await patientService.findSimilarPatients(id);

  return res.status(200).json({
    success: true,
    similar,
  });
};
