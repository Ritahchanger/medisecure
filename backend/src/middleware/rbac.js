module.exports = function (allowedRoles = []) {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({
          success: false,
          message: "Access denied: No user role found",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: Insufficient permissions",
        });
      }

      next();
    } catch (err) {
      console.error("❌ RBAC Middleware Error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error while checking permissions",
      });
    }
  };
};
