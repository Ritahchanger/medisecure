// services/patient.service.js
const Patient = require("../models/Patient");
const AuditLog = require("../models/AuditLog");
const encryptionService = require("./encryption.service");
const gcs = require("../utils/gcs");

// Extract stats from medical data
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
 * ✅ CREATE PATIENT - Encrypt all medical data
 */
exports.createPatient = async (user, data, files = []) => {
  try {
    console.log("=== PATIENT SERVICE CREATE ===");
    let uploadedFiles = [];

    // ✅ Upload files to GCS
    if (files && files.length > 0) {
      console.log(
        `📤 Processing ${files.length} files for direct GCP upload...`
      );

      uploadedFiles = await Promise.all(
        files.map(async (file) => {
          try {
            const fileName = `patients/${Date.now()}-${user.id}-${
              file.originalname
            }`;
            console.log(`📄 Uploading directly to GCP: ${file.originalname}`);

            const fileUrl = await gcs.uploadFromBuffer(
              file.buffer,
              fileName,
              file.mimetype
            );
            const fileDownloadUrl = await gcs.getSignedUrl(fileName);

            console.log(
              `✅ Successfully uploaded to GCP: ${file.originalname}`
            );

            return {
              fileUrl,
              fileDownloadUrl,
              uploadedBy: user.id,
              uploadedAt: new Date(),
            };
          } catch (fileError) {
            console.error(
              `❌ Failed to upload file ${file.originalname}:`,
              fileError
            );
            throw fileError;
          }
        })
      );
    }

    // ✅ Build complete medical JSON for encryption (INCLUDES name and dob)
    const medicalJSON = {
      name: data.name,
      dob: data.dob,
      conditions: data.conditions || [],
      symptoms: data.symptoms || [],
      treatments: data.treatments || [],
      allergies: data.allergies || [],
      medications: data.medications || [],
      notes: data.notes || "",
      diagnosis: data.diagnosis || "",
      clinicalNotes: data.clinicalNotes || "",
      // files are stored separately in the model, not in encrypted data
    };

    // ✅ Encrypt the entire medical JSON
    const encryptedData = await encryptionService.encrypt(medicalJSON);

    // ✅ Extract stats for quick access (these remain unencrypted for searching)
    const stats = extractMedicalStats(medicalJSON);

    // ✅ Save patient with encrypted data AND plaintext stats for filtering
    const patient = await Patient.create({
      name: data.name, // Keep name unencrypted for display
      dob: data.dob, // Keep dob unencrypted for display
      encryptedData: encryptedData, // All medical data encrypted here
      files: uploadedFiles,
      createdBy: user.id,
      // Store stats as plaintext for aggregation and filtering
      conditions: stats.conditions,
      symptoms: stats.symptoms,
      treatments: stats.treatments,
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
 * ✅ GET ALL PATIENTS - Decrypt medical data
 */
exports.getAllPatients = async (user) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    const decryptedPatients = await Promise.all(
      patients.map(async (p) => {
        try {
          // ✅ Decrypt the medical data
          const decryptedData = await encryptionService.decrypt(
            p.encryptedData
          );

          return {
            _id: p._id,
            name: p.name, // Use unencrypted name from model
            dob: p.dob, // Use unencrypted dob from model
            createdBy: p.createdBy,
            createdAt: p.createdAt,
            files: p.files,
            // Use decrypted medical data
            data: decryptedData,
            // Stats can come from either decrypted data or plaintext fields
            stats: {
              conditions: decryptedData.conditions || [],
              symptoms: decryptedData.symptoms || [],
              treatments: decryptedData.treatments || [],
            },
          };
        } catch (decryptError) {
          console.error(`❌ Error decrypting patient ${p._id}:`, decryptError);
          // Return basic info if decryption fails
          return {
            _id: p._id,
            name: p.name,
            dob: p.dob,
            createdBy: p.createdBy,
            createdAt: p.createdAt,
            files: p.files,
            data: {},
            stats: {
              conditions: p.conditions || [],
              symptoms: p.symptoms || [],
              treatments: p.treatments || [],
            },
            decryptionError: true,
          };
        }
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
 * ✅ GET ONE PATIENT - with decryption
 */
exports.getPatientById = async (user, id) => {
  try {
    const patient = await Patient.findById(id);
    if (!patient) throw new Error("Patient not found");

    // ✅ Decrypt the medical data
    const decryptedData = await encryptionService.decrypt(
      patient.encryptedData
    );

    await AuditLog.create({
      user: user.id,
      action: "VIEW_PATIENT",
      targetPatient: id,
    });

    return {
      _id: patient._id,
      name: patient.name, // Use unencrypted name
      dob: patient.dob, // Use unencrypted dob
      createdBy: patient.createdBy,
      createdAt: patient.createdAt,
      files: patient.files,
      // All medical data comes from decrypted source
      data: decryptedData,
      // Stats from decrypted data
      stats: {
        conditions: decryptedData.conditions || [],
        symptoms: decryptedData.symptoms || [],
        treatments: decryptedData.treatments || [],
      },
    };
  } catch (err) {
    console.error("❌ Error retrieving patient:", err);
    throw new Error("Failed to fetch patient");
  }
};

/**
 * ✅ GET PATIENTS BY CONDITIONS - Uses plaintext fields for filtering
 */
exports.getPatientsByConditions = async (conditions = [], options = {}) => {
  try {
    const {
      limit = 50,
      skip = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    // Build query using plaintext conditions field for performance
    let query = {};
    if (conditions.length > 0) {
      query.conditions = { $in: conditions };
    }

    const patients = await Patient.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(limit)
      .skip(skip)
      .populate("createdBy", "name email")
      .lean();

    // Decrypt patient data
    const decryptedPatients = await Promise.all(
      patients.map(async (p) => {
        try {
          const decryptedData = await encryptionService.decrypt(
            p.encryptedData
          );
          return {
            _id: p._id,
            name: p.name,
            dob: p.dob,
            createdBy: p.createdBy,
            createdAt: p.createdAt,
            files: p.files,
            data: decryptedData,
            stats: {
              conditions: decryptedData.conditions || [],
              symptoms: decryptedData.symptoms || [],
              treatments: decryptedData.treatments || [],
            },
            // Add condition matching info
            matchedConditions: p.conditions.filter((condition) =>
              conditions.includes(condition)
            ),
          };
        } catch (decryptError) {
          console.error(`❌ Error decrypting patient ${p._id}:`, decryptError);
          return null;
        }
      })
    );

    return decryptedPatients.filter((patient) => patient !== null);
  } catch (err) {
    console.error("❌ Error retrieving patients by conditions:", err);
    throw new Error("Failed to fetch patients by conditions");
  }
};

/**
 * ✅ GET ALL UNIQUE CONDITIONS - Uses plaintext aggregation
 */
exports.getAllUniqueConditions = async () => {
  const result = await Patient.aggregate([
    { $unwind: "$conditions" },
    {
      $group: {
        _id: "$conditions",
        patientCount: { $sum: 1 },
        samplePatients: {
          $push: {
            _id: "$_id",
            name: "$name",
            createdAt: "$createdAt",
          },
        },
      },
    },
    {
      $project: {
        condition: "$_id",
        patientCount: 1,
        samplePatients: { $slice: ["$samplePatients", 3] },
        _id: 0,
      },
    },
    { $sort: { patientCount: -1, condition: 1 } },
  ]);

  return result;
};

/**
 * ✅ SIMILAR PATIENT CASES - Uses plaintext fields for comparison
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

exports.deletePatient = async (user, patientId) => {
    console.log("=== PATIENT SERVICE DELETE ===");
    console.log(`🗑️ Deleting patient: ${patientId}`);
    console.log(`👤 Requested by user: ${user.id}`);

    // Find the patient first
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    // ✅ Delete all files from Google Cloud Storage
    if (patient.files && patient.files.length > 0) {
      console.log(`📁 Deleting ${patient.files.length} files from GCS...`);

      const deleteFilePromises = patient.files.map(async (file) => {
        try {
          // Extract filename from GCS URL (gs://bucket-name/filename)
          const gcsUrl = file.fileUrl;
          const fileName = gcsUrl.replace(
            `gs://${process.env.GCS_BUCKET}/`,
            ""
          );

          console.log(`🗑️ Deleting file from GCS: ${fileName}`);
          await gcs.deleteFromGCS(fileName);
          console.log(`✅ Successfully deleted file: ${fileName}`);

          return fileName;
        } catch (fileError) {
          console.error(`❌ Failed to delete file ${file.fileUrl}:`, fileError);
          // Don't throw here - we want to continue deleting other files and the patient record
          // Log the error but continue with patient deletion
          return null;
        }
      });

      // Wait for all file deletions to complete
      await Promise.allSettled(deleteFilePromises);
      console.log(
        `✅ Completed file deletion process for patient ${patientId}`
      );
    } else {
      console.log(`ℹ️ No files to delete for patient ${patientId}`);
    }

    // ✅ Delete the patient record from database
    const deletedPatient = await Patient.findByIdAndDelete(patientId);
    if (!deletedPatient) {
      throw new Error("Failed to delete patient record from database");
    }

    // ✅ Create audit log for deletion
    await AuditLog.create({
      user: user.id,
      action: "DELETE_PATIENT",
      targetPatient: patientId,
      metadata: {
        patientName: patient.name,
        filesDeleted: patient.files?.length || 0,
        deletedAt: new Date(),
      },
    });

    console.log(`✅ Patient ${patientId} deleted successfully`);

    return {
      message: "Patient and all associated files deleted successfully",
      patientId: patientId,
      patientName: patient.name,
      filesDeleted: patient.files?.length || 0,
      deletedAt: new Date(),
    };
};

/**
 * ✅ GLOBAL STATS - Uses plaintext aggregation
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
