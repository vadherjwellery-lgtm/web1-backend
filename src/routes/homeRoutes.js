import express from "express";
import { getHome, createHomeImage, updateHomeImage, deleteHomeImage, updateHomeTitle, getStoryImages, uploadStoryImage, deleteStoryImage, getHomeVideo, uploadHomeVideo, deleteHomeVideo, getTypeStripImage, uploadTypeStripImage, deleteTypeStripImage } from "../controllers/homeController.js";
import upload from "../middleware/upload.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getHome);
router.post("/image", protect, adminOnly, upload.single("image"), createHomeImage);
router.put("/image/:id", protect, adminOnly, upload.single("image"), updateHomeImage);
router.delete("/image/:id", protect, adminOnly, deleteHomeImage);
router.put("/title", protect, adminOnly, updateHomeTitle);

// Story Image routes
router.get("/story-images", getStoryImages);
router.post("/story-image", protect, adminOnly, upload.single("image"), uploadStoryImage);
router.delete("/story-image/:position", protect, adminOnly, deleteStoryImage);

// Video routes
router.get("/video", getHomeVideo);
router.post("/video", protect, adminOnly, upload.single("video"), uploadHomeVideo);
router.delete("/video/:id", protect, adminOnly, deleteHomeVideo);

// Type Strip Image routes
router.get("/type-strip-image", getTypeStripImage);
router.post("/type-strip-image", protect, adminOnly, upload.single("image"), uploadTypeStripImage);
router.delete("/type-strip-image/:id", protect, adminOnly, deleteTypeStripImage);

export default router;
