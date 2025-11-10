const User = require("../models/User");
const jwt = require("jsonwebtoken");

const AuthLog = require("../models/AuditLog");

const UAParser = require('ua-parser-js');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.register = async ({ name, email, password, role }, req) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    await logAuthEvent(email, "login_failed", req, null, "user_not_found");
    throw new Error("User already exists");
  }

  const newUser = await User.create({ name, email, password, role });
  await logAuthEvent(email, "register", req, newUser._id);

  const token = generateToken(newUser);

  return {
    message: "User registered successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  };
};

exports.login = async ({ email, password }, req) => {
  console.log("🔐 LOGIN ATTEMPT STARTED =======================");
  console.log("📧 Email:", email);
  console.log("🔑 Password length:", password ? password.length : "undefined");
  console.log("🌐 IP Address:", req.ip);
  console.log("👤 User Agent:", req.headers["user-agent"]);

  try {
    // Check for suspicious activity
    console.log("🕵️ Checking for suspicious activity...");
    const suspiciousCheck = await AuthLog.checkSuspiciousActivity(email, req.ip);
    console.log("🕵️ Suspicious check result:", JSON.stringify(suspiciousCheck, null, 2));
    
    if (suspiciousCheck.isSuspicious) {
      console.log("🚨 SUSPICIOUS ACTIVITY DETECTED - Blocking login");
      await logAuthEvent(email, "login_failed", req, null, "account_locked");
      throw new Error("Too many failed attempts. Please try again later.");
    }

    // Find user
    console.log("👤 Searching for user in database...");
    const user = await User.findOne({ email });
    console.log("👤 User found:", user ? `Yes (ID: ${user._id}, Role: ${user.role})` : "No");
    
    if (!user) {
      console.log("❌ USER NOT FOUND");
      await logAuthEvent(email, "login_failed", req, null, "user_not_found");
      throw new Error("Invalid email or password");
    }

    // Check password
    console.log("🔑 Comparing passwords...");
    const isMatch = await user.comparePassword(password);
    console.log("🔑 Password match:", isMatch);
    
    if (!isMatch) {
      console.log("❌ PASSWORD MISMATCH");
      await logAuthEvent(email, "login_failed", req, user._id, "invalid_password");
      throw new Error("Invalid email or password");
    }

    // Successful login
    console.log("✅ LOGIN SUCCESSFUL");
    await logAuthEvent(email, "login_success", req, user._id);
    
    console.log("🎫 Generating JWT token...");
    const token = generateToken(user);
    console.log("🎫 Token generated successfully");

    console.log("✅ LOGIN COMPLETED SUCCESSFULLY ===============");
    
    return {
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };

  } catch (error) {
    console.log("❌ LOGIN FAILED WITH ERROR:", error.message);
    console.log("🔍 Error stack:", error.stack);
    console.log("❌ LOGIN PROCESS ENDED WITH ERROR =============");
    throw error; // Re-throw to be handled by controller
  }
};

const getClientInfo = (req) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();

  return {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers["user-agent"],
    deviceInfo: {
      browser: result.browser.name,
      os: result.os.name,
      device: result.device.type || "desktop",
      isMobile: result.device.type === "mobile",
    },
  };
};

const logAuthEvent = async (
  email,
  action,
  req,
  userId = null,
  failureReason = "none"
) => {
  const clientInfo = getClientInfo(req);

  try {
    await AuthLog.create({
      userId,
      email,
      action,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      deviceInfo: clientInfo.deviceInfo,
      failureReason,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to log auth event:", error);
  }
};

exports.logout = async (user, req) => {
  await logAuthEvent(user.email, "logout", req, user._id);
  return { message: "Logout successful" };
};

exports.getAuthHistory = async (userId) => {
  return await AuthLog.getUserAuthHistory(userId);
};

exports.getSecurityReport = async (email, ipAddress) => {
  return await AuthLog.checkSuspiciousActivity(email, ipAddress);
};
