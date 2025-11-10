const authService = require("../services/auth.service");
const AuthLog = require("../models/AuditLog"); // ✅ Correct import

// Basic auth controllers
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.register(
      { name, email, password, role },
      req
    );
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password }, req);
    return res.json(result);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const result = await authService.logout(req.user, req);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Auth Logs controllers (Admin only)
// In controllers/auth.controller.js - FIXED VERSION
exports.getAllAuthLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      email,
      action,
      ipAddress,
      startDate,
      endDate,
      sortBy = "timestamp",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (email) filter.email = { $regex: email, $options: "i" };
    if (action) filter.action = action;
    if (ipAddress) filter.ipAddress = { $regex: ipAddress, $options: "i" };

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const logs = await AuthLog.find(filter)
      .populate("userId", "name email role")
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination - FIXED VARIABLE SCOPE
    const totalLogs = await AuthLog.countDocuments(filter);
    const totalPages = Math.ceil(totalLogs / limit); // ✅ Now properly defined

    return res.json({
      logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages, // ✅ Now this variable exists
        totalLogs,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching auth logs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserAuthLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, action, startDate, endDate } = req.query;

    const filter = { userId };
    if (action) filter.action = action;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuthLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await AuthLog.countDocuments(filter);

    return res.json({
      logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalLogs: total,
      },
    });
  } catch (error) {
    console.error("Error fetching user auth logs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMyAuthHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const logs = await AuthLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .select("action ipAddress deviceInfo location timestamp failureReason")
      .exec();

    return res.json({ logs });
  } catch (error) {
    console.error("Error fetching user auth history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAuthStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const stats = await AuthLog.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalLogins: {
            $sum: { $cond: [{ $eq: ["$action", "login_success"] }, 1, 0] },
          },
          totalFailures: {
            $sum: { $cond: [{ $eq: ["$action", "login_failed"] }, 1, 0] },
          },
          uniqueUsers: { $addToSet: "$userId" },
          uniqueIPs: { $addToSet: "$ipAddress" },
        },
      },
      {
        $project: {
          totalLogins: 1,
          totalFailures: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
          uniqueIPs: { $size: "$uniqueIPs" },
          failureRate: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$totalFailures",
                      { $add: ["$totalLogins", "$totalFailures"] },
                    ],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
    ]);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyStats = await AuthLog.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          logins: {
            $sum: { $cond: [{ $eq: ["$action", "login_success"] }, 1, 0] },
          },
          failures: {
            $sum: { $cond: [{ $eq: ["$action", "login_failed"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json({
      overall: stats[0] || {
        totalLogins: 0,
        totalFailures: 0,
        uniqueUsers: 0,
        uniqueIPs: 0,
        failureRate: 0,
      },
      dailyActivity: dailyStats,
    });
  } catch (error) {
    console.error("Error fetching auth stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSuspiciousActivity = async (req, res) => {
  try {
    const { hours = 24, minAttempts = 5 } = req.query;
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    const suspiciousIPs = await AuthLog.aggregate([
      { $match: { action: "login_failed", timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: "$ipAddress",
          failedAttempts: { $sum: 1 },
          targetedUsers: { $addToSet: "$email" },
          lastAttempt: { $max: "$timestamp" },
        },
      },
      { $match: { failedAttempts: { $gte: parseInt(minAttempts) } } },
      {
        $project: {
          ipAddress: "$_id",
          failedAttempts: 1,
          targetedUsers: { $size: "$targetedUsers" },
          lastAttempt: 1,
          _id: 0,
        },
      },
      { $sort: { failedAttempts: -1 } },
    ]);

    const suspiciousUsers = await AuthLog.aggregate([
      { $match: { action: "login_failed", timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: "$email",
          failedAttempts: { $sum: 1 },
          fromIPs: { $addToSet: "$ipAddress" },
          lastAttempt: { $max: "$timestamp" },
        },
      },
      { $match: { failedAttempts: { $gte: 3 } } },
      {
        $project: {
          email: "$_id",
          failedAttempts: 1,
          fromIPs: { $size: "$fromIPs" },
          lastAttempt: 1,
          _id: 0,
        },
      },
      { $sort: { failedAttempts: -1 } },
    ]);

    return res.json({
      suspiciousIPs,
      suspiciousUsers,
      reportTimeframe: `${hours} hours`,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error fetching suspicious activity:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
