import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

// Single file upload (image or video) under field name "file"
router.post("/single", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  // Public URL path to access the file
  const fileUrl = `/uploads/${req.file.path.split("uploads")[1].replace(/\\/g, "/")}`;

  res.json({
    success: true,
    file: {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: fileUrl,
    },
  });
});

export default router;
