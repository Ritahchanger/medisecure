const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },

  fileDownloadUrl: { type: String, required: true },

  uploadedAt: { type: Date, default: Date.now },

  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    dob: { type: String, required: true },

    encryptedData: { type: String, required: true },

    files: [FileSchema],

    conditions: [{ type: String }],

    symptoms: [{ type: String }],

    treatments: [{ type: String }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
