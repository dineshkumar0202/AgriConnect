import express from "express";
import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import { protect, sellerOnly } from "../middleware/auth.js";

const router = express.Router();

// User adds comment (buyer/seller/admin)
router.post("/", protect, async (req, res) => {
  try {
    const { postId, text } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      text
    });

    res.json(comment);
  } catch (err) {
    console.error("Create comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get comments for a post
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name email")
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Seller reply to comment
router.patch("/:id/reply", protect, sellerOnly, async (req, res) => {
  try {
    const { reply } = req.body;
    const comment = await Comment.findById(req.params.id).populate("post");
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (String(comment.post.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to reply" });
    }

    comment.sellerReply = reply;
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error("Reply comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;