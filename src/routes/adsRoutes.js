import express from "express";
import { getAds, createAd, updateAd, deleteAd } from "../controllers/adsController.js";
import upload from "../middleware/upload.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAds);
router.post("/", protect, adminOnly, upload.single("image"), createAd);
router.put("/:id", protect, adminOnly, upload.single("image"), updateAd);
router.delete("/:id", protect, adminOnly, deleteAd);

export default router;
