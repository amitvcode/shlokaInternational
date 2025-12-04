import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    images: {
      type: [String], // Array of image URLs or filenames
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Slider", sliderSchema);
