const patientService = require("../services/patient.service");

/**
 * @desc Create new patient record
 * @route POST /api/patients
 * @access Protected (doctor, nurse, admin)
 * Accepts optional file: req.file
 */
exports.createPatient = async (req, res) => {
  const user = req.user; // from auth middleware
  const data = req.body;
  const filePath = req.file ? req.file.path : null; // if using multer

  const result = await patientService.create(user, data, filePath);

  return res.status(201).json({
    success: true,
    message: result.message,
    patientId: result.patientId,
  });
};

/**
 * @desc Get all patients (with decrypted data)
 * @route GET /api/patients
 * @access Protected
 */
exports.getAllPatients = async (req, res) => {
  const user = req.user;
  const patients = await patientService.getAll(user);

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

  const patient = await patientService.getById(user, id);

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
  const stats = await patientService.stats();

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
  const similar = await patientService.findSimilar(id);

  return res.status(200).json({
    success: true,
    similar,
  });
};
