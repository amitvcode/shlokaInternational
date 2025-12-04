import Admin from "../models/Admin.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
export async function seedAdmin() {
  try {
    const existingAdmin = await Admin.findOne();
    if (!existingAdmin) {
      const hassedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: hassedPassword,
      });
      await admin.save();
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
  }
}
