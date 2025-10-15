import express from "express";
import {
  expressInterest,
  getInterestsForProduct,
} from "../controllers/interestController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:productId", verifyToken, expressInterest);
router.get("/:productId", verifyToken, getInterestsForProduct);

export default router;
