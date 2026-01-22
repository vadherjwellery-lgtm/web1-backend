import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 }).lean();

    // Fetch counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return { ...cat, productCount: count };
      })
    );

    res.json({ success: true, data: categoriesWithCounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get categories" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({ name });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create category" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, data: category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete category" });
  }
};
