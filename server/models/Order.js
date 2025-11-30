import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    quantityKg: {
      type: Number,
      required: true
    },
    pricePerKgSnapshot: {
      type: Number,
      required: true
    },
    extraPriceSnapshot: {
      type: Number
    },
    totalPrice: {
      type: Number,
      required: true
    },
    buyerName: String,
    buyerPhone: String,
    buyerEmail: String,
    sellerPhone: String,
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
