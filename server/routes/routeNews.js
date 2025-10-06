import express from "express";
import { createNews, getNews } from "../controllers/newsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/", verifyToken, createNews); // only admin in real case
router.get("/", getNews);

export default router;
