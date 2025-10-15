import express from "express";
import { createNews, getNews } from "../controllers/newsController.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, requireRole("admin"), createNews); // limit news creation to admin
router.get("/", getNews);

export default router;
