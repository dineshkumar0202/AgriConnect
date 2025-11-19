import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "devsecret", { expiresIn: "30d" });
};

// Register (user / seller / admin using adminSecret)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, language, adminSecret } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "email already registered" });

    let finalRole = role || "user";
    if (role === "admin") {
      if (!adminSecret || adminSecret !== (process.env.ADMIN_SECRET || "ADMIN123")) {
        return res.status(403).json({ message: "Invalid admin secret" });
      }
      finalRole = "admin";
    }

    const user = await User.create({ name, email, password, role: finalRole, language });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      language: user.language,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      language: user.language,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;