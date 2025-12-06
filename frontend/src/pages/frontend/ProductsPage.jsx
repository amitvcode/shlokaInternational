import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { useCart } from "../../context/CartContext";
import API from "../../api/api";
import { getImageUrl } from "../../api/api";

export default function ProductsPage() {
    const { addToCart } = useCart();

  const location = useLocation();
  const { subcategoryId, subcategoryName } = location.state || {};
  const [products, setProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState({}); // Track selected thumbnail per product

  useEffect(() => {
    if (subcategoryId) {
      axios
        .get(`https://shlokainternational-2.onrender.com/api/products/subcategory/${subcategoryId}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Error fetching products:", err));
    }
  }, [subcategoryId]);

  // initialize selected image for each product to the first image for a cleaner UX
  useEffect(() => {
    if (products && products.length) {
      const init = {};
      products.forEach((p) => {
        if (p.images && p.images.length > 0) init[p._id] = p.images[0];
      });
      setSelectedImage((prev) => ({ ...init, ...prev }));
    }
  }, [products]);

  if (!subcategoryId) {
    return (
      <div className="pt-24 text-center text-gray-600">
        Please select a subcategory first.
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-5">
      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Products in <span className="text-indigo-700">{subcategoryName || "this Subcategory"}</span>
      </h1>

      {products.length > 0 ? (
        <div className="flex flex-col gap-12 ">
          {products.map((prod) => (
            <div
              key={prod._id}
              className="flex flex-col lg:flex-row gap-6 p-6 border border-indigo-500  shadow-sm hover:shadow-md transition-all duration-300 bg-white"
            >
              {/* Left: Images (thumbnails column + main image) */}
              <div className="flex flex-col sm:flex-row lg:flex-row gap-4 w-full lg:w-1/2">
                {/* Thumbnails (vertical on large screens) */}
                <div className="hidden lg:flex flex-col gap-3 w-20 items-center flex-shrink-0">
                  <div className="flex flex-col gap-3 w-full max-h-[520px] py-1">
                    {prod.images && prod.images.length > 0 ? (
                      prod.images.map((img, index) => {
                        const isSelected = selectedImage[prod._id] === img;
                        return (
                          <button
                            key={index}
                            onClick={() =>
                              setSelectedImage((prev) => ({
                                ...prev,
                                [prod._id]: img,
                              }))
                            }
                            className={`w-full h-16 p-1  flex items-center justify-center transition-transform transform ${
                              isSelected
                                ? "ring-1 ring-indigo-500 scale-105"
                                : "hover:scale-105"
                            }`}
                            aria-label={`Select thumbnail ${index + 1}`}
                          >
                            <img
                              src={getImageUrl(`products/${img}`)}
                              alt={`${prod.title} thumb ${index + 1}`}
                              className="w-full h-full object-contain  border"
                            />
                          </button>
                        );
                      })
                    ) : (
                      <div className="w-full h-16 flex items-center justify-center ">
                        <img
                          src="https://via.placeholder.com/60x60?text=No+Image"
                          alt="No Image"
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Image */}
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className="bg-white border border-indigo-400  shadow-sm w-full max-w-full
                                  h-[320px] sm:h-[420px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden p-4"
                  >
                    <img
                      src={
                        selectedImage[prod._id]
                          ? getImageUrl(`products/${selectedImage[prod._id]}`)
                          : prod.images && prod.images.length > 0
                          ? getImageUrl(`products/${prod.images[0]}`)
                          : "https://via.placeholder.com/500x500?text=No+Image"
                      }
                      alt={prod.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                {/* Thumbnails (horizontal for small screens) */}
                <div className="lg:hidden flex gap-3 w-full overflow-x-auto mt-2 sm:mt-0 sm:flex-shrink-0">
                  {prod.images && prod.images.length > 0 ? (
                    prod.images.map((img, index) => {
                      const isSelected = selectedImage[prod._id] === img;
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            setSelectedImage((prev) => ({
                              ...prev,
                              [prod._id]: img,
                            }))
                          }
                          className={`w-20 h-20 p-1 rounded-md flex-shrink-0 transition-transform transform ${
                            isSelected
                              ? "ring-2 ring-indigo-500 scale-105"
                              : "hover:scale-105"
                          }`}
                          aria-label={`Select thumbnail ${index + 1}`}
                        >
                          <img
                            src={getImageUrl(`products/${img}`)}
                            alt={`${prod.title} thumb ${index + 1}`}
                            className="w-full h-full object-contain rounded-sm border"
                          />
                        </button>
                      );
                    })
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center border rounded-sm">
                      <img
                        src="https://via.placeholder.com/60x60?text=No+Image"
                        alt="No Image"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Title, description and enquiry button (PRICE / OTHER OPTIONS REMOVED) */}
              <div className="text-sm w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-grey-600">
                    {prod.title}
                  </h1>

                  <div className="mt-4">
                    <div
                      className="text-gray-600 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(prod.description || ""),
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                
                {/* Add to Cart Button */}
                 <button
      onClick={() => addToCart(prod)}
      className="cursor-pointer w-full sm:w-1/2 py-3.5 bg-green-600 text-white rounded
                hover:bg-green-700 transition font-bold"
    >
      Add to Cart
    </button>

                {/* Enquiry Button */}
                <a
                  href={`mailto:vamit00000@gmail?subject=${encodeURIComponent(
                    `Enquiry about ${prod.title}`
                  )}`}
                  className="w-full sm:w-1/2 py-3.5 bg-indigo-600 text-white rounded  
                            hover:bg-indigo-700 transition text-center font-bold"
                >
                  Enquiry
                </a>
              </div>

                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No products found for this subcategory.
        </p>
      )}
    </div>
  );
}
