import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
// import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://agriconnect-market.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

io.on("connection", (socket) => {
  console.log("Client connected via Socket", socket.id);
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure uploads dir
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors({
  origin: ["http://localhost:5173", "https://agriconnect-market.onrender.com"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options('*', cors()); // Enable preflight processing across the board
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

connectDB();

app.get("/", (req, res) => {
  res.send("AgriConnect API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server & Socket running on port ${PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`⚠️ Port ${PORT} in use. Trying 0 (random port)...`);
    httpServer.listen(0, () => {
      console.log("Now running on random available port.");
    });
  }
});
