import mongoose from "mongoose";

const typeStripImageSchema = new mongoose.Schema(
    {
        imageUrl: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("TypeStripImage", typeStripImageSchema);
