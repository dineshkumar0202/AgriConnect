import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import commandeRoutes from "./routes/comments.js";
import newsRoutes from "./routes/news.js";
import interestRoutes from "./routes/interest.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true}));


// Routes
app.use("/api/auth", authRoutes);
app.use(".api/products", productRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/interests", interestRoutes);

// connect to MongoDB

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
