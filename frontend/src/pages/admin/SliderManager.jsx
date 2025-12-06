import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { getImageUrl } from "../../api/api";
import axios from "axios";
import { FaTrash, FaUpload, FaImages } from "react-icons/fa";

export default function SliderManager() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSliders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/slider");
      setSliders(res.data);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/slider/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Slider uploaded successfully!");
      setSelectedFiles([]);
      fetchSliders();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/slider/${id}`);
      alert("Slider deleted successfully");
      fetchSliders();
    } catch (error) {
      console.error("Error deleting slider:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaImages className="text-blue-600" /> Manage Slider Images
          </h1>
        </div>

        {/* Upload Box */}
        <form
          onSubmit={handleUpload}
          className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-md p-6 mb-10 hover:shadow-lg transition-all"
        >
          <label className="block text-lg font-semibold mb-3 text-gray-700">
            Upload New Slider Images
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full sm:w-auto flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
            >
              <FaUpload /> {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>

        {/* Slider Grid */}
        {sliders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sliders.map((slider) => (
              <div
                key={slider._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <div className="grid grid-cols-2 gap-2 p-4">
                  {slider.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(`slider/${img}`)}
                      alt="slider"
                      className="w-full h-32 object-cover rounded-xl group-hover:scale-105 transition-transform"
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleDelete(slider._id)}
                  className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full shadow hover:bg-red-700 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <FaImages className="text-6xl mb-4 opacity-50" />
            <p className="text-lg">No slider images uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
