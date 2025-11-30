import express from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Sellers and buyers list
router.get("/sellers", protect, adminOnly, async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).sort({ createdAt: -1 });
    res.json(sellers);
  } catch (err) {
    console.error("Get sellers error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/buyers", protect, adminOnly, async (req, res) => {
  try {
    const buyers = await User.find({ role: "user" }).sort({ createdAt: -1 });
    res.json(buyers);
  } catch (err) {
    console.error("Get buyers error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Stats + activities
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalPosts = await Post.countDocuments();

    const latestPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("seller", "name email");

    const latestComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email")
      .populate("post", "title");

    res.json({ totalUsers, totalSellers, totalPosts, latestPosts, latestComments });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
