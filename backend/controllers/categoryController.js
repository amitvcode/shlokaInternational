import Category from "../models/Category.js";
import { MainCategory } from "../models/MainCategory.js";

// ✅ Create category
export const createCategory = async (req, res) => {
  try {
    const { name, mainCategory } = req.body;

    if (!name || !mainCategory) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCategory = new Category({ name, mainCategory });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Fetch categories with main category data
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("mainCategory", "name")
      .sort({ createdAt: 1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update category
export const updateCategory = async (req, res) => {
  try {
    const { name, mainCategory } = req.body;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, mainCategory },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
