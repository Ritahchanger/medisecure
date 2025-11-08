const {
  getAllAdmins,
  getAdminById,
  getAdminsWithFilters,
  getAdminStats,
} = require("../services/admin.service");

/**
 * Controller to get all admin users
 * @route GET /api/admins
 */
const getAllAdminsController = async (req, res) => {
  const result = await getAllAdmins();

  if (!result.success) {
    return res.status(404).json({
      success: false,
      message: result.error || "No admin users found",
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: `Successfully retrieved ${result.count} admin users`,
    data: result.data,
    count: result.count,
  });
};

/**
 * Controller to get admin by ID
 * @route GET /api/admins/:id
 */
const getAdminByIdController = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Admin ID is required",
    });
  }

  const result = await getAdminById(id);

  if (!result.success) {
    return res.status(404).json({
      success: false,
      message: result.error || "Admin user not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Admin user retrieved successfully",
    data: result.data,
  });
};

/**
 * Controller to get admins with filters
 * @route GET /api/admins/filter
 */
const getAdminsWithFiltersController = async (req, res) => {
  const filters = req.query; // Get filters from query parameters

  const result = await getAdminsWithFilters(filters);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error || "Failed to fetch filtered admin users",
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: `Found ${result.count} admin users matching filters`,
    data: result.data,
    count: result.count,
    filters: result.filters,
  });
};

/**
 * Controller to get admin statistics
 * @route GET /api/admins/stats
 */
const getAdminStatsController = async (req, res) => {
  const result = await getAdminStats();

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error || "Failed to fetch admin statistics",
    });
  }

  res.status(200).json({
    success: true,
    message: "Admin statistics retrieved successfully",
    data: result.data,
  });
};

/**
 * Controller to search admins by name or email
 * @route GET /api/admins/search
 */
const searchAdminsController = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  // Use the filters service with search criteria
  const result = await getAdminsWithFilters({
    $or: [
      { name: { $regex: q, $options: "i" } }, // Case-insensitive name search
      { email: { $regex: q, $options: "i" } }, // Case-insensitive email search
    ],
  });

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error || "Search failed",
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: `Found ${result.count} admin users matching "${q}"`,
    data: result.data,
    count: result.count,
    searchQuery: q,
  });
};

module.exports = {
  getAllAdminsController,
  getAdminByIdController,
  getAdminsWithFiltersController,
  getAdminStatsController,
  searchAdminsController,
};
