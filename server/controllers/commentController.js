import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const { productId, text, parentId } = req.body;
    const comment = await Comment.create({
      productId,
      text,
      parentId: parentId || null,
      userId: req.user.id,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comment = await Comment.find({
      productId: req.params.productId,
    }).populate("userId", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
