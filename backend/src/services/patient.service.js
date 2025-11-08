// services/patient.service.js
const Patient = require("../models/Patient");
const AuditLog = require("../models/AuditLog");
const encryptionService = require("./encryption.service");
const gcs = require("../utils/gcs");

// Extract stats
function extractMedicalStats(medicalData) {
  return {
    conditions: medicalData.conditions || [],
    symptoms: medicalData.symptoms || [],
    treatments: medicalData.treatments || [],
  };
}

// Similarity scoring (Jaccard Index)
function similarityScore(listA, listB) {
  if (!listA.length || !listB.length) return 0;

  const setA = new Set(listA);
  const setB = new Set(listB);

  const intersection = [...setA].filter((x) => setB.has(x));
  const union = new Set([...listA, ...listB]);

  return intersection.length / union.size;
}

/**
 * ✅ CREATE PATIENT (Supports MULTIPLE FILES)
 */
exports.createPatient = async (user, data, files = []) => {
  try {
    console.log("=== PATIENT SERVICE CREATE ===");
    let uploadedFiles = [];

    // ✅ Upload all files to GCS
    if (files && files.length > 0) {
      uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const fileName = `patients/${Date.now()}-${user.id}-${file.originalname}`;
          const fileUrl = await gcs.uploadToGCS(file.path, fileName);
          const fileDownloadUrl = await gcs.getSignedUrl(fileName);

          return {
            fileUrl,
            fileDownloadUrl,
            uploadedBy: user.id,
            uploadedAt: new Date(),
          };
        })
      );
    }

    // ✅ Build complete medical JSON for encryption
    const medicalJSON = {
      name: data.name,
      dob: data.dob,
      conditions: data.conditions || [],
      symptoms: data.symptoms || [],
      treatments: data.treatments || [],
      files: uploadedFiles,
    };

    // ✅ Encrypt medical JSON
    const encrypted = await encryptionService.encrypt(medicalJSON);

    // ✅ Extract stats
    const stats = extractMedicalStats(data);

    // ✅ Save patient
    const patient = await Patient.create({
      name: data.name,
      dob: data.dob,
      encryptedData: encrypted,
      createdBy: user.id,
      files: uploadedFiles,
      ...stats,
    });

    // ✅ Audit log
    await AuditLog.create({
      user: user.id,
      action: "CREATE_PATIENT",
      targetPatient: patient._id,
    });

    return {
      message: "Patient record created successfully",
      patientId: patient._id,
    };
  } catch (err) {
    console.error("❌ Error creating patient:", err);
    throw new Error("Failed to create patient");
  }
};

/**
 * ✅ GET ALL PATIENTS — decrypted
 */
exports.getAllPatients = async (user) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    const decryptedPatients = await Promise.all(
      patients.map(async (p) => {
        const decrypted = await encryptionService.decrypt(p.encryptedData);

        return {
          _id: p._id,
          name: p.name,
          dob: p.dob,
          createdBy: p.createdBy,
          createdAt: p.createdAt,
          files: p.files,
          stats: {
            conditions: p.conditions,
            symptoms: p.symptoms,
            treatments: p.treatments,
          },
          data: decrypted,
        };
      })
    );

    await AuditLog.create({
      user: user.id,
      action: "VIEW_PATIENT_LIST",
    });

    return decryptedPatients;
  } catch (err) {
    console.error("❌ Error retrieving patients:", err);
    throw new Error("Failed to fetch patients");
  }
};

/**
 * ✅ GET ONE PATIENT (with decryption)
 */
exports.getPatientById = async (user, id) => {
  try {
    const p = await Patient.findById(id);
    
    if (!p) throw new Error("Patient not found");

    const decrypted = await encryptionService.decrypt(p.encryptedData);

    await AuditLog.create({
      user: user.id,
      action: "VIEW_PATIENT",
      targetPatient: id,
    });

    return {
      _id: p._id,
      name: p.name,
      dob: p.dob,
      createdBy: p.createdBy,
      createdAt: p.createdAt,
      files: p.files,
      stats: {
        conditions: p.conditions,
        symptoms: p.symptoms,
        treatments: p.treatments,
      },
      data: decrypted,
    };
  } catch (err) {
    console.error("❌ Error retrieving patient:", err);
    throw new Error("Failed to fetch patient");
  }
};

/**
 * ✅ SIMILAR PATIENT CASES
 */
exports.findSimilarPatients = async (id) => {
  const target = await Patient.findById(id);
  if (!target) throw new Error("Patient not found");

  const patients = await Patient.find({ _id: { $ne: id } });

  return patients
    .map((p) => ({
      _id: p._id,
      name: p.name,
      similarity: similarityScore(target.conditions, p.conditions),
      sharedConditions: p.conditions.filter((c) =>
        target.conditions.includes(c)
      ),
    }))
    .filter((p) => p.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity);
};

/**
 * ✅ GLOBAL STATS (Big Data aggregation)
 */
exports.getPatientStats = async () => {
  const result = await Patient.aggregate([
    { $unwind: "$conditions" },
    {
      $group: {
        _id: "$conditions",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return result;
};