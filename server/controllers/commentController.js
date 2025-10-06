import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      productId: req.body.productId,
      userId: req.user.id,
      text: req.body.text
    });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId })
      .populate("userId", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
