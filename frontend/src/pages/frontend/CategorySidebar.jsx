import React, { useState, useEffect } from "react";
import API from "../../api/api"; // ← Use the same API instance
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function CategorySidebar() {
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // 🧩 Fetch All Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [mainRes, catRes, subRes] = await Promise.all([
          API.get("/main-categories"),
          API.get("/categories"),
          API.get("/subCategory"),
        ]);


        // Handle main categories response
        if (mainRes.data.success && mainRes.data.categories) {
          setMainCategories(mainRes.data.categories);
        } else if (Array.isArray(mainRes.data)) {
          setMainCategories(mainRes.data);
        } else {
          console.error("Unexpected main categories format:", mainRes.data);
          setMainCategories([]);
        }

        // Handle categories response
        if (catRes.data.success && catRes.data.categories) {
          setCategories(catRes.data.categories);
        } else if (Array.isArray(catRes.data)) {
          setCategories(catRes.data);
        } else {
          console.error("Unexpected categories format:", catRes.data);
          setCategories([]);
        }

        // Handle subcategories response
        if (subRes.data.success && subRes.data.subCategories) {
          setSubCategories(subRes.data.subCategories);
        } else if (Array.isArray(subRes.data)) {
          setSubCategories(subRes.data);
        } else {
          console.error("Unexpected subcategories format:", subRes.data);
          setSubCategories([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Set default active category from URL or first category
  useEffect(() => {
    if (!loading && categories.length > 0) {
      const categoryFromUrl = searchParams.get("category");
      if (categoryFromUrl) {
        setActiveCategory(categoryFromUrl);
      } else if (!activeCategory) {
        // Set first category as active by default
        const firstCategoryWithSubs = categories.find(cat => 
          getSubCategoriesByCategory(cat._id).length > 0
        );
        if (firstCategoryWithSubs) {
          setActiveCategory(firstCategoryWithSubs._id);
          setSearchParams({ category: firstCategoryWithSubs._id });
        }
      }
    }
  }, [loading, categories, searchParams]);

  // 🔗 Helper to get nested items
  const getCategoriesByMain = (mainId) =>
    categories.filter((cat) => cat.mainCategory?._id === mainId);

  const getSubCategoriesByCategory = (catId) =>
    subCategories.filter((sub) => sub.category?._id === catId);

  // 🧭 Navigate to products
  const handleCardClick = (sub, categoryId) => {
    navigate("/products", {
      state: { 
        subcategoryId: sub._id, 
        subcategoryName: sub.name,
        categoryId: categoryId // Pass the category ID to restore state when returning
      }
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600 text-lg">
        Loading categories...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[80vh] text-red-600 text-lg">
        {error}
      </div>
    );

  return (
    <div className="pt-20 bg-gray-50 min-h-screen px-6 md:px-20">
      <div className="flex flex-col md:flex-row gap-6">

  {/* Right Side Content (Products) */}
  <main className="order-1 md:order-2 flex-1 bg-white shadow-md rounded-2xl p-6 border border-gray-100 my-8">
    {activeCategory ? (
      getSubCategoriesByCategory(activeCategory).length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 ">
            Subcategories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 border-t pt-4">
            {getSubCategoriesByCategory(activeCategory).map((sub) => (
              <div
                key={sub._id}
                onClick={() => handleCardClick(sub, activeCategory)}
                className="border rounded-xl overflow-hidden shadow hover:shadow-xl cursor-pointer transition-all group"
              >
                <img
                  src={
                    sub.image
                      ? `https://shlokainternational-2.onrender.com/uploads/subCategories/${sub.image}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={sub.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3 text-center font-semibold text-gray-700 group-hover:text-indigo-600">
                  {sub.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-20">
          No subcategories found for this category.
        </p>
      )
    ) : (
      <p className="text-gray-500 text-center mt-20">
        Select a category from the sidebar to view its subcategories.
      </p>
    )}
  </main>

  {/* Sidebar */}
  <aside className="order-2 md:order-1 w-full md:w-72 bg-white shadow-lg rounded-2xl overflow-y-auto md:h-[90vh] p-4 border border-gray-100">
    <h2 className="text-xl font-bold text-indigo-800 border-b pb-3 mb-4">
      Main Categories
    </h2>

    {mainCategories.length === 0 ? (
      <p className="text-gray-500 text-sm text-center py-4  ">
        No categories available
      </p>
    ) : (
      <ul className="space-y-3  ">
        {mainCategories.map((main) => (
          <li key={main._id}>
            <div className="p-2 rounded-lg text-gray-700 font-semibold text-sm bg-green-500 rounded-lg ">
              {main.name}
            </div>
            {getCategoriesByMain(main._id).map((cat) => (
              <div key={cat._id} className="pl-4">
                <div
                  className={`flex justify-between items-center text-sm cursor-pointer rounded-lg font-semibold ${
                    activeCategory === cat._id
                      ? "bg-purple-50 text-purple-700"
                      : "hover:bg-gray-50 text-gray-600"
                  } transition`}
                  onClick={() => {
                    const newCategory =
                      activeCategory === cat._id ? null : cat._id;
                    setActiveCategory(newCategory);
                    setSearchParams(
                      newCategory ? { category: newCategory } : {}
                    );
                  }}
                >
                  <span>{cat.name}</span>
                  {activeCategory === cat._id ? (
                    <FaChevronDown size={10} />
                  ) : (
                    <FaChevronRight size={10} />
                  )}
                </div>

                {activeCategory === cat._id &&
                  getSubCategoriesByCategory(cat._id).length > 0 && (
                    <ul className="pl-4 py-1 space-y-1">
                      {getSubCategoriesByCategory(cat._id).map((sub) => (
                        <li
                          key={sub._id}
                          onClick={() => handleCardClick(sub, cat._id)}
                          className="text-gray-700 hover:text-indigo-600 text-sm font-medium cursor-pointer transition"
                        >
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            ))}
          </li>
        ))}
      </ul>
    )}
  </aside>
</div>

    </div>
  );
}
