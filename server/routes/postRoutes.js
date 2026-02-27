import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { Post } from "../models/Post.js";
import { Order } from "../models/Order.js";
import { protect, sellerOnly } from "../middleware/auth.js";
import { io } from "../server.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();

// Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "agriconnect_posts", // Folder on Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"]
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

    const imageUrl = req.file ? req.file.path : "";

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

    // Populate the seller info so frontend can display name
    const populatedPost = await Post.findById(post._id).populate("seller", "name");

    // Broadcast notification to all connected clients
    io.emit("new_post", {
      message: `New crop available: ${title} by ${populatedPost.seller.name}!`,
      post: populatedPost
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

// Get my stats
router.get("/my/stats", protect, sellerOnly, async (req, res) => {
  try {
    const sellerId = req.user._id;

    // We sum up the quantity weight instead of "Total Views"
    const myPosts = await Post.find({ seller: sellerId });
    const stockKg = myPosts.reduce((sum, p) => sum + (p.quantityKg || 0), 0);

    const orders = await Order.find({ seller: sellerId });
    const inquiries = orders.length;

    const revenue = orders.reduce((sum, ord) => sum + (ord.totalPrice || 0), 0);

    // Return mapped to { views, inquiries, revenue } where 'views' acts as Listed Stock limit gauge
    res.json({ views: stockKg, inquiries, revenue });
  } catch (err) {
    console.error("Get my stats error:", err);
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
