import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubcategoriesById,
  updateSubCategories,
  deleteSubCategories,
} from "../controllers/subCategoryController.js";
import uploads from "../middleware/uploadSubCategoryMiddleware.js";
const router = express.Router();

router.post(
  "/",
  uploads.single("image"), // 'image' must match the FormData key from frontend
  createSubCategory
);

router.get("/", getSubCategories);
router.get("/:id", getSubcategoriesById);
router.put("/:id", uploads.single("image"), updateSubCategories);
router.delete("/:id", deleteSubCategories);
export default router;
