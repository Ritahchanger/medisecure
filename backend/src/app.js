const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const patientRoutes = require("./routes/patient.routes");

const logger = require("./utils/logger");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// ===== Global Middlewares =====
app.use(cors());
app.use(express.json());
app.use(logger);

// ===== Health Check =====
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend healthy ✅" });
});

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);

// ===== ERROR HANDLING (must be last!) =====
app.use(errorMiddleware);

module.exports = app;
