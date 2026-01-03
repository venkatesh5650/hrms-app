const authService = require("../services/authService");

async function register(req, res,next) {
  try {
    const { orgName, email, password } = req.body;
    if (!orgName || !email || !password) {
      return res
        .status(400)
        .json({ message: "orgName, email and password are required" });
    }

    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res,next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const result = await authService.login(req.body);
    if (!result)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res,next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.split(" ")[1];

    await authService.logout(token, req.user);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout };
