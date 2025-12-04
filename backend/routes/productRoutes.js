import express from "express";
import {
  createProducts,
  getProducts,
  getProductsById,
  deleteProducts,
  updateProducts,
  deleteProductImage,
  getProductsBySubcategory,
  updateSerailNumber,
} from "../controllers/productController.js";
import uploads from "../middleware/productMiddleware.js";
const router = express.Router();

// Create new product (max 4 images)
router.post("/", uploads.array("images", 6), createProducts);

// Get all products OR by ?categoryId=...
router.get("/", getProducts);

// Get single product by ID
router.get("/:id", getProductsById);

// Update product
router.put("/:id", uploads.array("images", 6), updateProducts);

// Delete product
router.delete("/:id", deleteProducts);

router.delete("/:id/image", deleteProductImage);

router.get("/subcategory/:subcategoryId", getProductsBySubcategory);

router.put("/update-srno/:id", updateSerailNumber);
export default router;
