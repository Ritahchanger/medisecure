const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patient.controller");
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const asyncHandler = require("../middleware/asyncHandler");

// ✅ Multer for optional file upload
const upload = require("../utils/multer"); // you will create this file

// Allowed roles
const allowedRoles = ["doctor", "nurse", "admin"];

/**
 * ✅ Create patient (supports file upload)
 * POST /api/patients
 */
router.post(
  "/",
  auth,
  rbac(allowedRoles),
  upload.single("file"), // optional file
  asyncHandler(patientController.createPatient)
);

/**
 * ✅ Get all patients
 * GET /api/patients
 */
router.get(
  "/",
  auth,
  rbac(allowedRoles),
  asyncHandler(patientController.getAllPatients)
);

/**
 * ✅ Get one patient by ID
 * GET /api/patients/:id
 */
router.get(
  "/:id",
  auth,
  rbac(allowedRoles),
  asyncHandler(patientController.getPatientById)
);

/**
 * ✅ Get global patient stats
 * GET /api/patients/stats/global
 */
router.get(
  "/stats/global",
  auth,
  rbac(allowedRoles),
  asyncHandler(patientController.getPatientStats)
);

/**
 * ✅ Find similar patients
 * GET /api/patients/similar/:id
 */
router.get(
  "/:id/similar",
  auth,
  rbac(allowedRoles),
  asyncHandler(patientController.getSimilarPatients)
);

module.exports = router;
