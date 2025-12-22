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

      // Prepare user data for frontend
      const userData = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture,
        role: req.user.role
      };

      // Redirect to frontend with token and user data
      const userParam = encodeURIComponent(JSON.stringify(userData));
      res.redirect(
        `https://vadherjawellery.netlify.app/auth/callback?token=${token}&user=${userParam}`
      );
    } catch (err) {
      console.log(err);
      res.redirect("https://vadherjawellery.netlify.app/auth/callback?error=" + encodeURIComponent("Login failed. Please try again."));
    }
  }
);

router.get("/me", protect, getMe);

export default router;
