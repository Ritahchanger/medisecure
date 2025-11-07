module.exports = (err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);

  // If the error is thrown intentionally from service
  const status = err.statusCode || 500;

  return res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
