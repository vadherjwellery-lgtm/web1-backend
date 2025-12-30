import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    amazonLink: String,
    flipkartLink: String,
    meeshoLink: String,
    whatsappLink: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
  },
  { timestamps: true }
);

// Add compound index for category-based sorting
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model("Product", productSchema);

