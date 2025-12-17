import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-__v").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get users" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user.wishlist || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get wishlist" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const exists = user.wishlist?.some(
      (id) => id.toString() === productId.toString()
    );

    if (!exists) {
      user.wishlist = [...(user.wishlist || []), productId];
      await user.save();
    }

    res.json({ success: true, message: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add to wishlist" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.wishlist = (user.wishlist || []).filter(
      (id) => id.toString() !== productId.toString()
    );

    await user.save();

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to remove from wishlist" });
  }
};
