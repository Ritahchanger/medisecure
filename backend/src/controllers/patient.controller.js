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

  // ✅ FIXED: Remove encryptedData validation - only check name and dob
  if (!patientData.name || !patientData.dob) {
    console.log("❌ Missing required fields in patientData");
    return res.status(400).json({
      success: false,
      message: "Name and Date of Birth are required fields",
    });
  }

  // ✅ Add default values for optional fields
  const processedData = {
    name: patientData.name,
    dob: patientData.dob,
    conditions: patientData.conditions || [],
    symptoms: patientData.symptoms || [],
    treatments: patientData.treatments || [],
    clinicalNotes: patientData.clinicalNotes || "",
    // Add other optional fields that your service expects
    allergies: patientData.allergies || [],
    medications: patientData.medications || [],
    notes: patientData.notes || "",
    diagnosis: patientData.diagnosis || "",
  };

  console.log("👤 User from auth:", req.user);
  console.log("📁 Files to process:", req.files ? req.files.length : 0);
  console.log("📊 Processed data for service:", processedData);

  try {
    // Call the service with the processed data
    console.log("🔄 Calling patientService.createPatient...");
    const result = await patientService.createPatient(
      req.user,
      processedData, // Use the processed data with defaults
      req.files || []
    );

    console.log("✅ Patient created successfully:", result.patientId);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in patient service:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create patient",
    });
  }
};

exports.deletePatient = async (req, res) => {
    console.log("=== DELETE PATIENT CONTROLLER ===");
    console.log(`🗑️ Patient ID to delete: ${req.params.id}`);
    console.log(`👤 User making request:`, req.user);

    const { id } = req.params;

    // Validate patient ID
    if (!id) {
      console.log("❌ Patient ID is required");
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    console.log("🔄 Calling patientService.deletePatient...");

    // Call the service to delete patient and all files
    const result = await patientService.deletePatient(req.user, id);

    console.log(`✅ Patient deletion completed: ${result.patientId}`);
    console.log(`📁 Files deleted: ${result.filesDeleted}`);

    res.json({
      success: true,
      message: result.message,
      data: {
        patientId: result.patientId,
        patientName: result.patientName,
        filesDeleted: result.filesDeleted,
        deletedAt: result.deletedAt,
      },
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
