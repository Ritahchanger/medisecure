const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

const asyncHandler = require("../middleware/asyncHandler");

// @route   POST /api/auth/register
router.post("/register", asyncHandler(authController.register));

// @route   POST /api/auth/login
router.post("/login", asyncHandler(authController.login));

router.post("/logout", asyncHandler(authController.logout));

router.get("/me/auth-history", asyncHandler(authController.getMyAuthHistory));

// Admin only routes
router.get("/admin/auth-logs", asyncHandler(authController.getAllAuthLogs));
router.get("/admin/auth-stats", asyncHandler(authController.getAuthStats));
router.get(
  "/admin/suspicious-activity",
  asyncHandler(authController.getSuspiciousActivity)
);
router.get(
  "/admin/user-auth-logs/:userId",
  asyncHandler(authController.getUserAuthLogs)
);

module.exports = router;
