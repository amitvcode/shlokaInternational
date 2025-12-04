import Slider from "../models/Slider.js";

// ➕ Add new slider images
export const createSlider = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ msg: "Please upload at least one image" });
    }

    const imagePaths = files.map((file) => file.filename);

    const slider = new Slider({ images: imagePaths });
    await slider.save();

    res.status(201).json({
      msg: "Slider images uploaded successfully",
      slider,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// 📜 Get all slider images
export const getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });
    res.status(200).json(sliders);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ❌ Delete a slider
export const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    await Slider.findByIdAndDelete(id);
    res.status(200).json({ msg: "Slider deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
