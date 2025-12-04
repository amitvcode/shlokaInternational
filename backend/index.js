import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./connection/db.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategory from "./routes/subCategoryRoutes.js";
import mainCategoryRoutes from "./routes/mainCategoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { seedAdmin } from "./seeders/seedUsers.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import searchRoutes from "./routes/search.js";
dotenv.config(); // Load .env

const app = express();
app.use("/uploads", express.static("uploads"));

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/main-categories", mainCategoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/subCategory", subCategory);
app.use("/api/login", authRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/search", searchRoutes);

// Database Connection
connectDB();
seedAdmin();
app.get("/", (req, res) => {
  res.send("🚀 Node.js + MongoDB API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
