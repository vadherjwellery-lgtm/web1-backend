import mongoose from "mongoose";

const homeTitleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "Home" },
  },
  { timestamps: true }
);

export default mongoose.model("HomeTitle", homeTitleSchema);
