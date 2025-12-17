import mongoose from "mongoose";

const storyImageSchema = new mongoose.Schema(
    {
        imageUrl: { type: String, required: true },
        position: { type: Number, required: true, min: 1, max: 3 }, // 1=large, 2=small-top, 3=small-bottom
    },
    { timestamps: true }
);

export default mongoose.model("StoryImage", storyImageSchema);
