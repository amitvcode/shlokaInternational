import express from "express";
import multer from "multer";
import {
  createSlider,
  getSliders,
  deleteSlider,
} from "../controllers/sliderController.js";

const router = express.Router();

// ✅ Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/slider/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ➕ Add slider images
router.post("/add", upload.array("images", 10), createSlider);

// 📜 Get all sliders
router.get("/", getSliders);

// ❌ Delete a slider
router.delete("/:id", deleteSlider);

export default router;
