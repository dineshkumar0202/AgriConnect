import express from "express";
import { News } from "../models/News.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

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

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, summary, imageUrl, source, link } = req.body;
    const item = await News.create({ title, summary, imageUrl, source, link });
    res.json(item);
  } catch (err) {
    console.error("Create news error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted" });
  } catch (err) {
    console.error("Delete news error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
