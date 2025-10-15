import Interest from "../models/Interest.js";
import Product from "../models/Product.js";

export const expressInterest = async (req, res) => {
  try {
    const { productId } = req.params;
    const exists = await Interest.findOne({ productId, userId: req.user.id });
    if (exists) return res.status(400).json({ error: "Already interested" });
    await Interest.create({ productId, userId: req.user.id });
    await Product.findByIdAndUpdate(productId, { $inc: { interestCount: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInterestsForProduct = async (req, res) => {
  try {
    const list = await Interest.find({
      productId: req.params.productId,
    }).populate("userId", "username email phone");
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
