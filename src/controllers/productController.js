import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find({}).populate("category").skip(skip).limit(limit),
      Product.countDocuments({}),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get product" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { category: categoryId };

    const [items, total] = await Promise.all([
      Product.find(filter).populate("category").skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get products by category" });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({ success: false, message: "Search query q is required" });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const regex = new RegExp(q, "i");
    const filter = { name: regex };

    const [items, total] = await Promise.all([
      Product.find(filter).populate("category").skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to search products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, amazonLink, flipkartLink, meeshoLink, whatsappLink, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: "Name and category are required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const relativePath = req.file.path.replace(/\\/g, "/");
    const imageUrl = `/uploads/${relativePath.split("uploads/")[1]}`;

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price) || 0,
      imageUrl,
      amazonLink,
      flipkartLink,
      meeshoLink,
      whatsappLink,
      category,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, amazonLink, flipkartLink, meeshoLink, whatsappLink, category } = req.body;

    const updateData = {
      name,
      description,
      price: parseFloat(price) || 0,
      amazonLink,
      flipkartLink,
      meeshoLink,
      whatsappLink,
      category,
    };

    if (req.file) {
      const relativePath = req.file.path.replace(/\\/g, "/");
      updateData.imageUrl = `/uploads/${relativePath.split("uploads/")[1]}`;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};
