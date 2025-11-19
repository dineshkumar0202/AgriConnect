import express from "express";
import { News } from "../models/News.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public: get latest news (default limit 20)
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const news = await News.find().sort({ createdAt: -1 }).limit(limit);
    res.json(news);
  } catch (err) {
    console.error("Get news error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: create news item
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const item = await News.create(req.body);
    res.json(item);
  } catch (err) {
    console.error("Create news error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;