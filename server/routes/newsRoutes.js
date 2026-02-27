import express from "express";
import { News } from "../models/News.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "agriconnect_news",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"]
  }
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const news = await News.find().sort({ createdAt: -1 }).limit(limit);
    res.json(news);
  } catch (err) {
    console.error("Get news error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { title, summary, source, link } = req.body;
    const imageUrl = req.file ? req.file.path : "";

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
