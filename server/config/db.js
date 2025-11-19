import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/agri_marketplace", {
      dbName: "agri_marketplace"
    });
    console.log(`MongoDB connected🌱: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error 🔴:", err.message);
    process.exit(1);
  }
};