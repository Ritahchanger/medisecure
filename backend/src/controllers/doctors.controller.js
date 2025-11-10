const doctorService = require("../services/doctors.service");

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private/Admin
const getDoctors = async (req, res) => {
  try {
    const { page, limit, search, sortBy, sortOrder } = req.query;

    const result = await doctorService.getDoctors({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || "",
      sortBy: sortBy || "createdAt",
      sortOrder: sortOrder || "desc",
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Private/Admin
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const result = await doctorService.getDoctorById(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get doctor by ID error:", error);

    if (error.message === "Doctor not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const result = await doctorService.deleteDoctor(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Delete doctor error:", error);

    if (error.message === "Doctor not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Search doctors
// @route   GET /api/doctors/search
// @access  Private/Admin
const searchDoctors = async (req, res) => {
  try {
    const { query, page, limit } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const result = await doctorService.searchDoctors(
      query,
      parseInt(page) || 1,
      parseInt(limit) || 10
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Search doctors error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get doctors statistics
// @route   GET /api/doctors/stats
// @access  Private/Admin
const getDoctorsStats = async (req, res) => {
  try {
    const result = await doctorService.getDoctorsStats();
    res.status(200).json(result);
  } catch (error) {
    console.error("Get doctors stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  deleteDoctor,
  searchDoctors,
  getDoctorsStats,
};
