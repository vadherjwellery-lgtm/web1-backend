import mongoose from "mongoose";

const homeVideoSchema = new mongoose.Schema(
    {
        videoUrl: { type: String, required: true },
        title: { type: String, default: "Featured Video" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("HomeVideo", homeVideoSchema);
