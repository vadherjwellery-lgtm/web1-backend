import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import session from "express-session";
import passport from "./config/passport.js";

dotenv.config();
const app = express();
app.set("trust proxy", 1); // required for secure cookies behind proxies (e.g., Render)

// ==================
// Middleware
// ==================
const corsOptions = {
  origin: "https://vadherjawellery.netlify.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
// Express 5 no longer accepts bare "*" for path; use wildcard pattern.
app.options("/*", cors(corsOptions));

app.use(express.json());

// Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
