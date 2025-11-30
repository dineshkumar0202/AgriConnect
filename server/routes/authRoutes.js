import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "secret123", { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role, adminSecret } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let finalRole = role || "user";
    if (finalRole === "admin") {
      const secret = process.env.ADMIN_SECRET || "ADMIN123";
      if (adminSecret !== secret) {
        return res.status(400).json({ message: "Invalid admin secret" });
      }
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: finalRole
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: genToken(user._id)
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: genToken(user._id)
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
