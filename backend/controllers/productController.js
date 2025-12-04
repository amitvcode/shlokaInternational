import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

// ✅ Create Product
export const createProducts = async (req, res) => {
  try {
    const { title, description, subcategory } = req.body;
    const files = req.files;

    if (!title || !description || !subcategory) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const imageFilenames = files ? files.map((file) => file.filename) : [];
    if (imageFilenames.length > 6) {
      return res.status(400).json({ msg: "Maximum 6 images allowed." });
    }

    const lastProduct = await Product.findOne().sort({ srNo: -1 });
    const nextSrNo = lastProduct ? lastProduct.srNo + 1 : 1;

    const newProduct = new Product({
      srNo: nextSrNo,
      title,
      description,
      subcategory,
      images: imageFilenames,
    });

    await newProduct.save();

    res.status(200).json({
      msg: "Product created successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ msg: "Server error", error });
  }
};

// ✅ Get All Products (sorted by srNo)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("subcategory", "name");

    return res.status(200).json({ allProducts: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Something went wrong!" });
  }
};

// ✅ Get Product by ID
export const getProductsById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong!" });
  }
};

// ✅ Update Product
export const updateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subcategory, existingImages } = req.body;
    const files = req.files;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ msg: "Product not found" });
    }

    // Keep only selected old images
    let keptImages = [];
    if (existingImages) {
      keptImages = JSON.parse(existingImages);
    }

    // Delete removed images from folder
    const removedImages = product.images.filter(
      (img) => !keptImages.includes(img)
    );
    removedImages.forEach((img) => {
      const oldPath = path.join("uploads/products", img);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    });

    // Add new images
    const newImages = files ? files.map((file) => file.filename) : [];
    product.images = [...keptImages, ...newImages];
    product.title = title || product.title;
    product.description = description || product.description;
    product.subcategory = subcategory || product.subcategory;

    await product.save();

    res.status(200).json({
      msg: "Product updated successfully!",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong!" });
  }
};

// ✅ Delete Product
export const deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found!" });

    // Delete images from folder
    product.images.forEach((img) => {
      const filePath = path.join("uploads/products", img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ msg: "Product deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Something went wrong!" });
  }
};

// ✅ Delete a single image from product
export const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params; // product ID
    const { image } = req.body; // image filename to delete

    if (!image) return res.status(400).json({ msg: "Image is required" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Remove image from product.images array
    product.images = product.images.filter((img) => img !== image);
    await product.save();

    // Remove file from server
    const filePath = path.join("uploads/products", image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({ msg: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

// ✅ Get products by subcategory (sorted by srNo)
export const getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const products = await Product.find({ subcategory: subcategoryId })
      .sort({ srNo: 1 }) // ✅ Sort by serial number ascending
      .populate("subcategory", "name");

    if (!products.length)
      return res.status(404).json({ msg: "No products found" });

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Something went wrong!" });
  }
};

export const updateSerailNumber = async (req, res) => {
  try {
    const { srNo } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { srNo },
      { new: true }
    );
    if (!updated)
      return res.json({ success: false, message: "Product not found" });
    res.json({ success: true, product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
