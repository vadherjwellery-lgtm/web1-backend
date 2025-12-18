import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import passport from "passport";
import "./config/passport.js";

dotenv.config();
const app = express();

// ==================
// Middleware
// ==================
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://vadherjawellery.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

// ==================
// DB Connection
// ==================
connectDB();

// ==================
// Routes
// ==================
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import adsRoutes from "./routes/adsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
app.use("/ads", adsRoutes);
app.use("/category", categoryRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);

// ==================
// Static uploads
// ==================
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================
// Upload routes
// ==================
app.use("/upload", uploadRoutes);

// ==================
// Start Server
// ==================
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on PORT ${process.env.PORT || 5000}`);
});
