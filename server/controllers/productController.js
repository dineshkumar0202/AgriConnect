import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const body = req.body;

    const product = await Product.create({ ...body, sellerId: req.user.id });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const product = await product
      .find()
      .populate("sellerId", "username phone contactPubilc");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "sellerId",
      "username phone contactPublic"
    );
    if (!product) return res.status(404).json({ error: "Not Found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
