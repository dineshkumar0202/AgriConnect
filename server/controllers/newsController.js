import News from "../models/News.js";

export const createNews = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const n = await News.create({ title, content, image });
    res.status(201).json(n);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
