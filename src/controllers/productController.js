import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100); // Cap at 100 to prevent memory issues
    const skip = (page - 1) * limit;

    // Use lean() for better performance and select only necessary fields initially
    const [items, total] = await Promise.all([
      Product.find({})
        .populate("category", "name") // Only populate category name, not all fields
        .sort({ createdAt: -1 }) // Add explicit sorting
        .skip(skip)
        .limit(limit)
        .lean(), // Convert to plain JavaScript objects for better performance
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
    const product = await Product.findById(id)
      .populate("category", "name")
      .lean();

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
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = { category: categoryId };

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
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
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const regex = new RegExp(q, "i");
    const filter = { name: regex };

    // Support searching within a category
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
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

    // Convert image buffer to base64 data URL
    const base64Data = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;

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
      // Convert new image to base64 data URL
      const base64Data = req.file.buffer.toString('base64');
      updateData.imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;
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
