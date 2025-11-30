import express from "express";
import multer from "multer";
import path from "path";
import { Post } from "../models/Post.js";
import { protect, sellerOnly } from "../middleware/auth.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create post
router.post("/", protect, sellerOnly, upload.single("image"), async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      pricePerKg,
      extraPrice,
      quantityKg,
      locationText,
      liveLocationUrl,
      availableDate,
      sellerPhone
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const post = await Post.create({
      seller: req.user._id,
      type,
      title,
      description,
      pricePerKg,
      extraPrice,
      quantityKg,
      imageUrl,
      locationText,
      liveLocationUrl,
      availableDate,
      sellerPhone
    });

    res.json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Get active posts
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const posts = await Post.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("seller", "name email");
    res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get my posts
router.get("/my", protect, sellerOnly, async (req, res) => {
  try {
    const posts = await Post.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Get my posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle active
router.patch("/:id/toggle", protect, sellerOnly, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, seller: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.isActive = !post.isActive;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Toggle post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete
router.delete("/:id", protect, sellerOnly, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, seller: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
