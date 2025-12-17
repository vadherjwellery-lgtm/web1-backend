import jwt from "jsonwebtoken";
import client from "../config/googleAuth.js";
import User from "../models/userModel.js";

const ADMIN_EMAILS = [
  "rudrakukadiya111@gmail.com",
  "vadherjwellery@gmail.com",
];

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload?.email || "";

    // Determine if user is admin
    const isAdmin = ADMIN_EMAILS.includes(email);
    const userRole = isAdmin ? "admin" : "user";

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user (admin or regular user)
      user = await User.create({
        name: payload.name,
        email,
        picture: payload.picture,
        role: userRole,
      });
    } else {
      // Update existing user's role if needed
      if (isAdmin && user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token: jwtToken, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Google Login Failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};
