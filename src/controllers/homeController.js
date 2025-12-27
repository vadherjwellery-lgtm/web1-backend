import HomeImage from "../models/homeImageModel.js";
import HomeTitle from "../models/homeTitleModel.js";
import StoryImage from "../models/storyImageModel.js";
import HomeVideo from "../models/homeVideoModel.js";
import TypeStripImage from "../models/typeStripImageModel.js";

export const getHome = async (req, res) => {
  try {
    const [titleDoc] = await HomeTitle.find({}).sort({ updatedAt: -1 }).limit(1);
    const images = await HomeImage.find({}).sort({ createdAt: 1 });
    const storyImages = await StoryImage.find({}).sort({ position: 1 });
    const [video] = await HomeVideo.find({ isActive: true }).sort({ updatedAt: -1 }).limit(1);
    const [typeStripImage] = await TypeStripImage.find({ isActive: true }).sort({ updatedAt: -1 }).limit(1);

    res.json({
      success: true,
      data: {
        title: titleDoc ? titleDoc.title : "Home",
        images,
        storyImages,
        video: video || null,
        typeStripImage: typeStripImage || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get home data" });
  }
};


export const createHomeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const base64Data = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;

    const image = await HomeImage.create({ imageUrl });
    res.status(201).json({ success: true, data: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create home image" });
  }
};

export const updateHomeImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const base64Data = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;

    const image = await HomeImage.findByIdAndUpdate(
      id,
      { imageUrl },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    res.json({ success: true, data: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update home image" });
  }
};

export const deleteHomeImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await HomeImage.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete home image" });
  }
};

export const updateHomeTitle = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const homeTitle = await HomeTitle.findOneAndUpdate(
      {},
      { title },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: homeTitle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update home title" });
  }
};

// Story Image functions
export const getStoryImages = async (req, res) => {
  try {
    const storyImages = await StoryImage.find({}).sort({ position: 1 });
    res.json({ success: true, data: storyImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get story images" });
  }
};

export const uploadStoryImage = async (req, res) => {
  try {
    const { position } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    if (!position || position < 1 || position > 3) {
      return res.status(400).json({ success: false, message: "Position must be 1, 2, or 3" });
    }

    const base64Data = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;

    // Upsert - update if exists, insert if not
    const storyImage = await StoryImage.findOneAndUpdate(
      { position: parseInt(position) },
      { imageUrl, position: parseInt(position) },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, data: storyImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to upload story image" });
  }
};

export const deleteStoryImage = async (req, res) => {
  try {
    const { position } = req.params;
    const image = await StoryImage.findOneAndDelete({ position: parseInt(position) });

    if (!image) {
      return res.status(404).json({ success: false, message: "Story image not found" });
    }

    res.json({ success: true, message: "Story image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete story image" });
  }
};

// Video functions
export const getHomeVideo = async (req, res) => {
  try {
    const [video] = await HomeVideo.find({ isActive: true }).sort({ updatedAt: -1 }).limit(1);
    res.json({ success: true, data: video || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get home video" });
  }
};

export const uploadHomeVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Video is required" });
    }

    const base64Data = req.file.buffer.toString('base64');
    const videoUrl = `data:${req.file.mimetype};base64,${base64Data}`;
    const title = req.body.title || "Featured Video";

    // Deactivate any existing videos
    await HomeVideo.updateMany({}, { isActive: false });

    // Create new active video
    const video = await HomeVideo.create({ videoUrl, title, isActive: true });
    res.status(201).json({ success: true, data: video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to upload home video" });
  }
};

export const deleteHomeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await HomeVideo.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    res.json({ success: true, message: "Video deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete home video" });
  }
};

// Type Strip Image functions
export const getTypeStripImage = async (req, res) => {
  try {
    const [image] = await TypeStripImage.find({ isActive: true }).sort({ updatedAt: -1 }).limit(1);
    res.json({ success: true, data: image || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get type strip image" });
  }
};

export const uploadTypeStripImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const base64Data = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;

    // Deactivate any existing images
    await TypeStripImage.updateMany({}, { isActive: false });

    // Create new active image
    const image = await TypeStripImage.create({ imageUrl, isActive: true });
    res.status(201).json({ success: true, data: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to upload type strip image" });
  }
};

export const deleteTypeStripImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await TypeStripImage.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({ success: false, message: "Type strip image not found" });
    }

    res.json({ success: true, message: "Type strip image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete type strip image" });
  }
};
