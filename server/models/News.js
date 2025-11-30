import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    imageUrl: { type: String },
    source: { type: String, default: "Admin" },
    link: { type: String }
  },
  { timestamps: true }
);

export const News = mongoose.model("News", NewsSchema);
