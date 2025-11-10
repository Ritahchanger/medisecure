const mongoose = require("mongoose");

const AuthLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    action: {
      type: String,
      enum: [
        "login_success",
        "login_failed",
        "logout",
        "register",
        "password_change",
        "token_refresh",
      ],
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: false,
    },
    failureReason: {
      type: String,
      enum: [
        "invalid_password",
        "user_not_found",
        "account_locked",
        "invalid_token",
        "expired_token",
        "none",
      ],
      default: "none",
    },
    location: {
      country: String,
      city: String,
      region: String,
    },
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
      isMobile: Boolean,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    indexes: [
      { email: 1, timestamp: -1 },
      { ipAddress: 1, timestamp: -1 },
      { userId: 1, timestamp: -1 },
    ],
  }
);

// Static method to check for suspicious activity
AuthLogSchema.statics.checkSuspiciousActivity = async function (
  email,
  ipAddress,
  thresholdMinutes = 5,
  maxAttempts = 5
) {
  const thresholdTime = new Date(Date.now() - thresholdMinutes * 60 * 1000);

  const recentFailures = await this.countDocuments({
    email,
    action: "login_failed",
    timestamp: { $gte: thresholdTime },
  });

  const ipFailures = await this.countDocuments({
    ipAddress,
    action: "login_failed",
    timestamp: { $gte: thresholdTime },
  });

  return {
    isSuspicious: recentFailures >= maxAttempts || ipFailures >= maxAttempts,
    userFailures: recentFailures,
    ipFailures: ipFailures,
  };
};

// Method to get user's login history
AuthLogSchema.statics.getUserAuthHistory = async function (userId, limit = 50) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select("action ipAddress location deviceInfo timestamp failureReason");
};

module.exports = mongoose.model("AuthLog", AuthLogSchema);
