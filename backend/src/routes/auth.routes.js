const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

const asyncHandler = require("../middleware/asyncHandler");

// @route   POST /api/auth/register
router.post("/register", asyncHandler(authController.register));

// @route   POST /api/auth/login
router.post("/login", asyncHandler(authController.login));

module.exports = router;
