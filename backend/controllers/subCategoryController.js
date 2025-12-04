import SubCategory from "../models/SubCategory.js";
import fs from "fs";
import path from "path";

export const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !category || !image) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newSubCategory = new SubCategory({
      name,
      category,
      image,
    });

    await newSubCategory.save();

    return res.status(200).json({
      success: true,
      msg: "Sub category created successfully!",
      subCategory: newSubCategory,
    });
  } catch (error) {
    console.error("SubCategory creation error:", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    // Use await and populate the category name
    const subCategories = await SubCategory.find()
      .populate("category", "name") // include parent category's name
      .sort({ createdAt: 1 });

    return res.status(200).json(subCategories); // send the array directly
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

export const getSubcategoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await SubCategory.findById(id);
    return res.status(200).json({ data: subcategory });
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong!" });
  }
};

export const updateSubCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    const image = req.file ? req.file.filename : null;

    // ✅ Find existing subcategory
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, msg: "Subcategory not found!" });
    }

    // ✅ Handle image update
    if (image) {
      const oldImagePath = path.join(
        "uploads/subCategories",
        subCategory.image || ""
      );
      if (subCategory.image && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      subCategory.image = image;
    }

    // ✅ Update text fields
    if (name) subCategory.name = name;
    if (category) subCategory.category = category;

    await subCategory.save();

    return res.status(200).json({
      success: true,
      msg: "Subcategory updated successfully!",
      data: subCategory,
    });
  } catch (error) {
    console.error("❌ Error updating subcategory:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error occurred",
      error: error.message,
    });
  }
};

export const deleteSubCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSubCategories = await SubCategory.findByIdAndDelete(id);
    return res.status(200).json({ msg: "SubCategories deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong" });
  }
};
