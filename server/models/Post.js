import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: { type: String, required: true }, // vegetable / fruit
    title: { type: String, required: true },
    description: { type: String },
    pricePerKg: { type: Number, required: true },
    extraPrice: { type: Number },
    quantityKg: { type: Number, required: true },
    imageUrl: { type: String },
    locationText: { type: String, required: true },
    liveLocationUrl: { type: String },
    availableDate: { type: Date },
    sellerPhone: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", PostSchema);
