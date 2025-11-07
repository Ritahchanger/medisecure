const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  action: { type: String, required: true }, // VIEW_PATIENT, CREATE_PATIENT, LOGIN, etc

  targetPatient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: false,
  },

  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
