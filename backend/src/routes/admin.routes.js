const Router = require("express").Router;
const AdminController = require("../controllers/admin.controller");
const allowedRoles = ["admin"];
const rbac = require("../middleware/rbac");
const asyncHandler = require("../middleware/asyncHandler");
const auth = require("../middleware/auth");

const router = Router();

// Apply admin authentication to all routes
router.use(auth, rbac(allowedRoles));

// GET /api/admins - Get all admins
router.get("/", asyncHandler(AdminController.getAllAdminsController));

// GET /api/admins/stats - Get admin statistics
router.get("/stats", asyncHandler(AdminController.getAdminStatsController));

// GET /api/admins/search - Search admins by name or email
router.get("/search", asyncHandler(AdminController.searchAdminsController));

// GET /api/admins/filter - Get admins with filters
router.get(
  "/filter",
  asyncHandler(AdminController.getAdminsWithFiltersController)
);

// GET /api/admins/:id - Get admin by ID
router.get("/:id", asyncHandler(AdminController.getAdminByIdController));

module.exports = router;
