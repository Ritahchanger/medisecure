const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const result = await authService.register({ name, email, password, role });

  return res.status(201).json(result);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  return res.json(result);
};
