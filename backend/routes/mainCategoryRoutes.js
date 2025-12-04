import express from "express";
import {
  createMainCategory,
  getAllMainCategories,
  updateMainCategory,
  deleteMainCategory,
} from "../controllers/mainCategoryController.js";

const router = express.Router();

// Base path is already /api/main-categories (from index.js)
// So we just use / and /:id

router.post("/", createMainCategory);        // POST   /api/main-categories
router.get("/", getAllMainCategories);       // GET    /api/main-categories
router.put("/:id", updateMainCategory);      // PUT    /api/main-categories/:id
router.delete("/:id", deleteMainCategory);   // DELETE /api/main-categories/:id

export default router;
