import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
} from "../controllers/productController.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, requireRole("seller"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
