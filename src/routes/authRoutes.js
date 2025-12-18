import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { googleLogin, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Client-side Google Auth
router.post("/google", googleLogin);

// Server-side OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login-failed" }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Redirect to frontend with token
      res.redirect(
        `https://vadherjawellery.netlify.app/login-success?token=${token}`
      );
    } catch (err) {
      console.log(err);
      res.redirect("https://vadherjawellery.netlify.app/login-failed");
    }
  }
);

router.get("/me", protect, getMe);

export default router;
