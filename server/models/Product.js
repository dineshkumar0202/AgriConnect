import mongoose, { now } from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String },
    discription: { type: String },
    price: { type: Number },
    category: { type: String, enum: ["fruits", "vegetables"] },
    location: { type: String },
    date: { type: Date, default: Date.now },
    Image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
