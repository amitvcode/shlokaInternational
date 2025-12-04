import { useState, useEffect } from "react";
import API from "../../api/api";
import { FaUpload, FaBoxes, FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";

export default function ProductForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const maxPagesToShow = 10;

  useEffect(() => {
    fetchAllCategories();
    fetchProducts();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const [mainRes, catRes, subRes] = await Promise.all([
        API.get("/main-categories"),
        API.get("/categories"),
        API.get("/subcategory")
      ]);

      setMainCategories(mainRes.data.categories || mainRes.data);
      setCategories(catRes.data);
      setAllSubCategories(subRes.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.allProducts || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length + newImages.length > 6) {
      alert("Maximum 6 images allowed!");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const handleRemoveNewImage = (index) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter(
      (_, i) => i !== existingImages.length + index
    );
    setNewImages(updatedNewImages);
    setPreviewImages(updatedPreviews);
  };

  const handleRemoveExistingImage = async (imageName) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await API.delete(`/products/${editingProductId}/image`, {
        data: { image: imageName },
      });
      const updatedExisting = existingImages.filter((img) => img !== imageName);
      setExistingImages(updatedExisting);
      setPreviewImages([
        ...updatedExisting.map(
          (img) => `http://localhost:5000/uploads/products/${img}`
        ),
        ...newImages.map((file) => URL.createObjectURL(file)),
      ]);
      alert("Image deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting image");
    }
  };

  // Filter functions for categories
  const getCategoriesByMain = (mainId) => {
    return categories.filter(cat => cat.mainCategory?._id === mainId);
  };

  const getSubcategoriesByCategory = (categoryId) => {
    return allSubCategories.filter(sub => sub.category?._id === categoryId);
  };

  // Handle category changes
  const handleMainCategoryChange = (e) => {
    const mainId = e.target.value;
    setMainCategory(mainId);
    setCategory(""); // Reset category when main category changes
    setSubcategory(""); // Reset subcategory when main category changes
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setCategory(catId);
    setSubcategory(""); // Reset subcategory when category changes
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMainCategory("");
    setCategory("");
    setSubcategory("");
    setNewImages([]);
    setExistingImages([]);
    setPreviewImages([]);
    setEditingProductId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !subcategory) {
      alert("All fields are required!");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subcategory", subcategory);
    newImages.forEach((file) => formData.append("images", file));
    if (editingProductId) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }
    try {
      if (editingProductId) {
        await API.put(`/products/${editingProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product updated successfully!");
      } else {
        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product created successfully!");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setTitle(product.title);
    setDescription(product.description);
    
    // Set subcategory and find its parent category and main category
    const subcategoryId = product.subcategory?._id;
    setSubcategory(subcategoryId || "");
    
    if (subcategoryId) {
      const subcategory = allSubCategories.find(sub => sub._id === subcategoryId);
      const categoryId = subcategory?.category?._id;
      
      if (categoryId) {
        setCategory(categoryId);
        const category = categories.find(cat => cat._id === categoryId);
        const mainCategoryId = category?.mainCategory?._id;
        if (mainCategoryId) {
          setMainCategory(mainCategoryId);
        }
      }
    }
    
    setExistingImages(product.images || []);
    const existingPreviews = product.images?.map(
      (img) => `http://localhost:5000/uploads/products/${img}`
    );
    setPreviewImages(existingPreviews || []);
    setNewImages([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  // Filter and pagination
  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxPagesToShow) {
    if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxPagesToShow / 2);
      endPage = currentPage + Math.floor(maxPagesToShow / 2);
    }
  }

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Reset page on new search or new product list
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, products.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-blue-800">
          Product Management
        </h1>

        {/* Product Form */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <FaBoxes className="text-blue-600" />
            {editingProductId ? "Update Product" : "Add New Product"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Description</label>
              <Editor
                apiKey="0bfnx4uwyv3r9jkkaufd8o5vsg323812ulwe604wulh3olas"
                value={description}
                onEditorChange={(content) => setDescription(content)}
                init={{
                  height: 250,
                  menubar: true,
                  plugins:
                    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount table",
                  toolbar:
                    "undo redo | bold italic underline | link image media table | align | numlist bullist | removeformat",
                }}
              />
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Category */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Main Category</label>
                <select
                  value={mainCategory}
                  onChange={handleMainCategoryChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Main Category</option>
                  {mainCategories.map((main) => (
                    <option key={main._id} value={main._id}>
                      {main.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Category</label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled={!mainCategory}
                >
                  <option value="">Select Category</option>
                  {mainCategory &&
                    getCategoriesByMain(mainCategory).map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Subcategory</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled={!category}
                >
                  <option value="">Select Subcategory</option>
                  {category &&
                    getSubcategoriesByCategory(category).map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <FaUpload className="inline text-blue-500 mr-1" />
                Upload Images (max 6)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-gray-700"
              />
              <div className="flex flex-wrap gap-3 mt-3">
                {previewImages.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        idx < existingImages.length
                          ? handleRemoveExistingImage(existingImages[idx])
                          : handleRemoveNewImage(idx - existingImages.length)
                      }
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition duration-300"
              >
                {editingProductId ? "Update Product" : "Add Product"}
              </button>
              {editingProductId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl font-semibold text-lg transition duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Bar & Product Table */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            📦 Product List
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-5 items-center">
            <div className="flex items-center w-full max-w-sm">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
              />
              <FaSearch className="ml-2 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Image</th>
                  <th className="border border-gray-300 px-4 py-2">Title</th>
                  <th className="border border-gray-300 px-4 py-2">Subcategory</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {p.images?.[0] ? (
                          <img
                            src={`http://localhost:5000/uploads/products/${p.images[0]}`}
                            alt={p.title}
                            className="w-16 h-16 object-cover rounded-md mx-auto"
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900">
                        {p.title}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-900">
                        {p.subcategory?.name || "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-gray-500 py-4 border"
                    >
                      No products available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-5 flex-wrap">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
