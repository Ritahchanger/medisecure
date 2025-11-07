const logger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      user: req.user ? req.user.id : "Unauthenticated",
      timestamp: new Date().toISOString(),
    };

    console.log("📨 Request Log:", log);
  });

  next();
};

module.exports = logger;
