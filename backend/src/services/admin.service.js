const User = require("../models/User");

/**
 * Service to get all admin users
 * @returns {Promise<Array>} Array of admin users without passwords
 */
const getAllAdmins = async () => {
  const admins = await User.find({ role: "admin" })
    .select("-password") // Exclude password for security
    .sort({ createdAt: -1 })
    .lean(); // Return plain JavaScript objects

  return {
    success: true,
    data: admins,
    count: admins.length,
  };
};

/**
 * Service to get admin by ID
 * @param {string} adminId - Admin user ID
 * @returns {Promise<Object>} Admin user data
 */
const getAdminById = async (adminId) => {
  const admin = await User.findOne({
    _id: adminId,
    role: "admin",
  }).select("-password");

  if (!admin) {
    return {
      success: false,
      error: "Admin user not found",
    };
  }

  return {
    success: true,
    data: admin,
  };
};

/**
 * Service to get admins with specific attributes
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array>} Filtered admin users
 */
const getAdminsWithFilters = async (filters = {}) => {
  const query = {
    role: "admin",
    ...filters,
  };

  const admins = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  return {
    success: true,
    data: admins,
    count: admins.length,
    filters: Object.keys(filters).length > 0 ? filters : null,
  };
};

/**
 * Service to get admin statistics
 * @returns {Promise<Object>} Admin statistics
 */
const getAdminStats = async () => {
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const activeAdmins = await User.countDocuments({
    role: "admin",
    "attributes.isActive": true,
  });
  const recentAdmins = await User.countDocuments({
    role: "admin",
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
  });

  return {
    success: true,
    data: {
      totalAdmins,
      activeAdmins,
      inactiveAdmins: totalAdmins - activeAdmins,
      recentAdmins,
      adminPercentage:
        totalAdmins > 0 ? ((activeAdmins / totalAdmins) * 100).toFixed(2) : 0,
    },
  };
};

module.exports = {
  getAllAdmins,
  getAdminById,
  getAdminsWithFilters,
  getAdminStats,
};
