// server/routes/routeProduct.js
import express from "express";
import { createProduct, getProducts } from "../controllers/productController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Seller adds a product
router.post("/", verifyToken, createProduct);

// All users view products
router.get("/", getProducts);

export default router;
