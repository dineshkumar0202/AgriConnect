import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    imageUrl: { type: String },
    source: { type: String },
    link: { type: String }
  },
  { timestamps: true }
);

export const News = mongoose.model("News", newsSchema);