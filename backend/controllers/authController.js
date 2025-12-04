import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 1. Validate fields
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // 🔹 2. Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found!" });
    }

    // 🔹 3. Compare password
    const isMatch = await bcrypt.compare(password, admin.password); // ✅ fixed (was user.password)
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password!" });
    }

    // 🔹 4. Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.JWT_SECRET, // ✅ store in .env file
      { expiresIn: "7d" } // optional: token expires in 7 days
    );

    // 🔹 5. Send response
    return res.status(200).json({
      msg: "Admin login successful!",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({ msg: "Something went wrong!" });
  }
};
