import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

// Single file upload (image or video) under field name "file"
router.post("/single", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  // Convert to base64 data URL
  const base64Data = req.file.buffer.toString('base64');
  const fileUrl = `data:${req.file.mimetype};base64,${base64Data}`;

  res.json({
    success: true,
    file: {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
    },
  });
});

export default router;
