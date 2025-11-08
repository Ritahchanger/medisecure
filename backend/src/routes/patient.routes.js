// routes/patient.routes.js
const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patient.controller");
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const asyncHandler = require("../middleware/asyncHandler");

// ✅ Multer for multiple file upload
const upload = require("../utils/multer");

// Allowed roles
const allowedRoles = ["doctor", "nurse", "admin"];

/**
 * ✅ Create patient (supports multiple file upload)
 * POST /api/patients
 */
router.post(
  "/",
  auth,
  rbac(allowedRoles),
  upload.array("files", 10), // Handle multiple files, max 10 files
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
 * ✅ Get all patient's conditions
 * GET /api/patient's  conditions
 */
router.get(
  "/conditions",
  auth,
  rbac(allowedRoles),
  asyncHandler(patientController.getAllConditions)
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


router.delete(
  "/:id",
  auth,
  rbac(["doctor", "admin"]), // Only doctors and admins can delete
  asyncHandler(patientController.deletePatient)
);

module.exports = router;
