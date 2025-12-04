import React, { useState, useEffect } from "react";
import axios from "axios";

export default function   ImageSlider() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🧩 Fetch images from backend
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/slider");
        if (res.data && res.data.length > 0) {
          // Flatten all image arrays from each slider document
          const allImages = res.data.flatMap((slider) =>
            slider.images.map(
              (img) => `http://localhost:5000/uploads/slider/${img}`
            )
          );
          setImages(allImages);
        }
      } catch (err) {
        console.error("Error fetching sliders:", err);
      }
    };
    fetchSliders();
  }, []);

  // ⏳ Auto slide every 3 seconds
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  const prevSlide = () =>
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  const nextSlide = () =>
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);

  if (images.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-gray-100">
        <p className="text-gray-600 text-lg">Loading slider...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[80vh] md:h-screen overflow-hidden ">
      {/* Slider Images */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`slide-${index}`}
            className="w-full flex-shrink-0 h-[80vh] md:h-screen object-cover"
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, idx) => (
          <span
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
              idx === currentIndex ? "bg-white scale-110" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
