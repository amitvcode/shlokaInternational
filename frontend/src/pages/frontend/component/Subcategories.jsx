import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubcategoriesSlider() {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const kitchenwareRef = useRef(null);
  const navigate = useNavigate();

  // 🧩 Fetch all subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/subCategory");
        setSubcategories(res.data);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubcategories();
  }, []);

  // 🧭 Navigate to products page
  const handleClick = (sub) => {
    navigate("/products", {
      state: { subcategoryId: sub._id, subcategoryName: sub.name },
    });
  };

  // 👈 Scroll left/right
  const scroll = (direction, ref) => {
    const current = ref?.current;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 text-gray-600 text-lg">
        Loading categories...
      </div>
    );
  }

  // Filter categories
  const disposableKeywords = ['areca', 'paper plate', 'disposable', 'box', 'packaging'];
  const kitchenwareKeywords = ['bar', 'accessor', 'kitchen', 'hotel', 'supplies', 'ware', 'tableware', 'barware'];
  
  const disposableProducts = subcategories.filter((sub) => {
    if (!sub || !sub.name) return false;
    const name = sub.name.toLowerCase();
    return disposableKeywords.some(keyword => name.includes(keyword));
  }).slice(0, 10);

  const kitchenwareProducts = subcategories.filter((sub) => {
    if (!sub || !sub.name) return false;
    const name = sub.name.toLowerCase();
    return !disposableProducts.some(dp => dp._id === sub._id) && 
           kitchenwareKeywords.some(keyword => name.includes(keyword));
  }).slice(0, 10);
  
  // If no disposable products found with specific keywords, show first 10 non-kitchenware items
  const fallbackDisposables = disposableProducts.length === 0 
    ? subcategories.filter(sub => 
        !kitchenwareProducts.some(kp => kp._id === sub._id)
      ).slice(0, 10)
    : [];

  // Use fallback if no disposable products found
  const finalDisposableProducts = disposableProducts.length > 0 ? disposableProducts : fallbackDisposables;
  
  // Duplicate items for infinite scroll effect
  const duplicatedDisposables = [...finalDisposableProducts, ...finalDisposableProducts];
  const duplicatedKitchenware = [...kitchenwareProducts, ...kitchenwareProducts];

  const renderCategorySection = (title, items, ref) => (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        {title}
      </h2>
      <div className="relative max-w-7xl mx-auto px-6">
        <button
          onClick={() => scroll("left", ref)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 rounded-full p-2 z-10 hidden md:block"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <div
          ref={ref}
          className="flex overflow-x-auto no-scrollbar space-x-5 scroll-smooth py-4"
        >
          {items.map((sub, index) => (
            <div
              key={`${sub._id}-${index}`}
              onClick={() => handleClick(sub)}
              className="flex-none w-56 cursor-pointer relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <img
                  src={
                    sub.image
                      ? `http://localhost:5000/uploads/subCategories/${sub.image}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={sub.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-medium text-gray-800">{sub.name}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right", ref)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 rounded-full p-2 z-10 hidden md:block"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="py-12">
      {renderCategorySection("Disposable Packaging Products", duplicatedDisposables, sliderRef)}
      {renderCategorySection("Hotel and Restaurent Supplies", duplicatedKitchenware, kitchenwareRef)}
    </div>
  );
}
