import express from "express";
import { Order } from "../models/Order.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { io } from "../server.js";

const router = express.Router();

// Create order
router.post("/", protect, async (req, res) => {
  try {
    const { postId, quantityKg } = req.body;
    if (!postId || !quantityKg) {
      return res.status(400).json({ message: "Post and quantity are required" });
    }

    const post = await Post.findById(postId).populate("seller", "name email phone");
    if (!post || !post.isActive) {
      return res.status(400).json({ message: "Post not available" });
    }

    const buyer = await User.findById(req.user._id);
    if (!buyer) {
      return res.status(400).json({ message: "Buyer not found" });
    }

    const qty = Number(quantityKg);
    if (!qty || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const pricePerKgSnapshot = Number(post.pricePerKg) || 0;
    const extraPriceSnapshot =
      typeof post.extraPrice === "number" ? Number(post.extraPrice) : undefined;
    const baseTotal = pricePerKgSnapshot * qty;
    const totalPrice = extraPriceSnapshot ? baseTotal + extraPriceSnapshot : baseTotal;

    const order = await Order.create({
      buyer: buyer._id,
      seller: post.seller._id,
      post: post._id,
      quantityKg: qty,
      pricePerKgSnapshot,
      extraPriceSnapshot,
      totalPrice,
      buyerName: buyer.name,
      buyerPhone: buyer.phone,
      buyerEmail: buyer.email,
      sellerPhone: post.sellerPhone || post.seller.phone,
      status: "confirmed"
    });

    const buyerMessage = `Successfully Order confirmed\nProduct: ${post.title}\nPrice per kg: ${pricePerKgSnapshot}\nQuantity: ${qty} Kg\nTotal: ${totalPrice}`;
    const sellerMessage = `New order received\nProduct: ${post.title}\nBuyer: ${buyer.name} (${buyer.phone || buyer.email})\nQuantity: ${qty} Kg\nTotal: ${totalPrice}`;

    const normalizePhone = (phone) => {
      if (!phone) return null;
      return phone.replace(/[^0-9]/g, "");
    };

    const buyerWhatsApp = normalizePhone(buyer.phone)
      ? `https://wa.me/${normalizePhone(
        buyer.phone
      )}?text=${encodeURIComponent(buyerMessage)}`
      : null;

    const sellerWhatsApp = normalizePhone(post.sellerPhone || post.seller.phone)
      ? `https://wa.me/${normalizePhone(
        post.sellerPhone || post.seller.phone
      )}?text=${encodeURIComponent(sellerMessage)}`
      : null;

    const buyerEmail = buyer.email
      ? `mailto:${buyer.email}?subject=${encodeURIComponent(
        "Order Confirmation"
      )}&body=${encodeURIComponent(buyerMessage)}`
      : null;

    const sellerEmail =
      post.seller.email &&
      `mailto:${post.seller.email}?subject=${encodeURIComponent(
        "New Order Received"
      )}&body=${encodeURIComponent(sellerMessage)}`;

    // 🔥 Emit real-time push notification to Seller
    io.to(post.seller._id.toString()).emit("personal_alert", {
      message: `🛒 New Order! ${buyer.name} bought ${qty}Kg of ${post.title}. Check Dashboard!`
    });

    res.json({
      order,
      buyerMessage,
      sellerMessage,
      buyerWhatsApp,
      sellerWhatsApp,
      buyerEmail,
      sellerEmail
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get my orders (buyer / seller)
router.get("/my", protect, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === "seller") {
      query.seller = req.user._id;
    } else {
      query.buyer = req.user._id;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("post", "title");

    res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
