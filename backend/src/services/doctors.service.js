const User = require("../models/User");

class DoctorService {
  /**
   * Get all doctors with pagination and search
   */
  async getDoctors({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  }) {
    try {
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

      // Build search query
      const searchQuery = {
        role: "doctor",
      };

      // Add search functionality
      if (search) {
        searchQuery.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Get doctors with pagination
      const doctors = await User.find(searchQuery)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const totalDoctors = await User.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalDoctors / limit);

      return {
        success: true,
        doctors,
        pagination: {
          currentPage: page,
          totalPages,
          totalDoctors,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch doctors: ${error.message}`);
    }
  }

  /**
   * Get doctor by ID
   */
  async getDoctorById(doctorId) {
    try {
      const doctor = await User.findOne({
        _id: doctorId,
        role: "doctor",
      }).select("-password");

      if (!doctor) {
        throw new Error("Doctor not found");
      }

      return {
        success: true,
        doctor,
      };
    } catch (error) {
      throw new Error(`Failed to fetch doctor: ${error.message}`);
    }
  }

  /**
   * Delete doctor by ID
   */
  async deleteDoctor(doctorId) {
    try {
      const doctor = await User.findOneAndDelete({
        _id: doctorId,
        role: "doctor",
      });

      if (!doctor) {
        throw new Error("Doctor not found");
      }

      return {
        success: true,
        message: "Doctor deleted successfully",
        deletedDoctor: {
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
        },
      };
    } catch (error) {
      throw new Error(`Failed to delete doctor: ${error.message}`);
    }
  }

  /**
   * Search doctors by name or email
   */
  async searchDoctors(query, page = 1, limit = 10) {
    try {
      const searchQuery = {
        role: "doctor",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      };

      const skip = (page - 1) * limit;

      const doctors = await User.find(searchQuery)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalDoctors = await User.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalDoctors / limit);

      return {
        success: true,
        doctors,
        pagination: {
          currentPage: page,
          totalPages,
          totalDoctors,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to search doctors: ${error.message}`);
    }
  }

  /**
   * Get doctors statistics
   */
  async getDoctorsStats() {
    try {
      const totalDoctors = await User.countDocuments({ role: "doctor" });
      const recentDoctors = await User.find({ role: "doctor" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email createdAt");

      return {
        success: true,
        stats: {
          totalDoctors,
          recentDoctors,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get doctor statistics: ${error.message}`);
    }
  }
}

module.exports = new DoctorService();
