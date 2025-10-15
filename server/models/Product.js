import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Fruits", "Vegetables"],
    },
    image: {
      type: String,
    },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    interestCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
