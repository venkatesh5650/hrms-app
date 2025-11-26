import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// ✅ SEED ADMIN (THIS WAS MISSING)
export const seedAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({
      email: "admin@company.com",
    });

    if (existingAdmin) {
      return res.json({
        message: "Admin already exists",
        email: existingAdmin.email,
      });
    }

    const admin = await User.create({
      name: "Admin",
      email: "admin@company.com",
      password: "Admin@123",
    });

    res.json({
      message: "Admin created",
      email: admin.email,
      password: "Admin@123",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to seed admin" });
  }
};
