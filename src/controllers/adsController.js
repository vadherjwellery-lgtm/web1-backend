import Ad from "../models/adModel.js";

export const getAds = async (req, res) => {
  try {
    const ads = await Ad.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: ads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get ads" });
  }
};

export const createAd = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const base64Data = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;

    const ad = await Ad.create({ imageUrl });
    res.status(201).json({ success: true, data: ad });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create ad" });
  }
};

export const updateAd = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const base64Data = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;

    const ad = await Ad.findByIdAndUpdate(
      id,
      { imageUrl },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    res.json({ success: true, data: ad });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update ad" });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findByIdAndDelete(id);

    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    res.json({ success: true, message: "Ad deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete ad" });
  }
};
