import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { FaTrashAlt, FaPlus, FaEdit, FaSearch } from "react-icons/fa";

export default function SubCategoryForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // For search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const maxPagesToShow = 10;

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await API.get("/subCategory");
      setSubCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !category || (!image && !editingId))
      return alert("All fields are required!");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      if (image) formData.append("image", image);

      if (editingId) {
        await API.put(`/subCategory/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("SubCategory updated successfully!");
      } else {
        await API.post("/subCategory", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("SubCategory created successfully!");
      }

      setName("");
      setCategory("");
      setImage(null);
      setPreview(null);
      setEditingId(null);
      fetchSubCategories();
    } catch (error) {
      console.error(error);
      alert("Error saving subcategory!");
    }
  };

  const handleEdit = (sub) => {
    setEditingId(sub._id);
    setName(sub.name);
    setCategory(sub.category?._id || "");
    setPreview(
      sub.image
        ? `http://localhost:5000/uploads/subCategories/${sub.image}`
        : null
    );
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?"))
      return;
    try {
      await API.delete(`/subCategory/${id}`);
      alert("SubCategory deleted successfully!");
      fetchSubCategories();
    } catch (error) {
      console.error(error);
      alert("Error deleting subcategory!");
    }
  };

  // Search & Filter logic
  const filteredSubCategories = subCategories.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || (sub.category && sub.category._id === filterCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredSubCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);

  // Calculate pagination window
  let startPage = 1;
  let endPage = totalPages;
  if (totalPages > maxPagesToShow) {
    if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + Math.floor(maxPagesToShow / 2) > totalPages) {
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxPagesToShow / 2);
      endPage = currentPage + Math.floor(maxPagesToShow / 2);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-center text-indigo-600 mb-10">
        SubCategory Management
      </h2>

      {/* Form */}
      <div className="bg-white shadow-xl rounded-3xl p-8 mb-12 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <label className="font-semibold">SubCategory Name</label>
          <input
            type="text"
            placeholder="Enter subcategory name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <label className="font-semibold">Parent Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label className="font-semibold">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border rounded-xl"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-xl border mt-2"
            />
          )}

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold shadow-lg transition transform hover:-translate-y-0.5 ${
                editingId
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {editingId ? <FaEdit /> : <FaPlus />}{" "}
              {editingId ? "Update" : "Add"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setCategory("");
                  setImage(null);
                  setPreview(null);
                }}
                className="px-6 py-3 rounded-xl bg-gray-400 hover:bg-gray-500 text-white font-bold shadow-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            placeholder="Search subcategories..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="p-3 border rounded-xl w-full max-w-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <FaSearch className="text-gray-400" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <select
            value={filterCategory}
            onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
            className="p-3 border rounded-xl w-full max-w-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-3xl overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">SubCategory Name</th>
              <th className="px-6 py-3">Parent Category</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  <td className="px-6 py-4">
                    {sub.image ? (
                      <img
                        src={`http://localhost:5000/uploads/subCategories/${sub.image}`}
                        alt={sub.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-4">{sub.name}</td>
                  <td className="px-6 py-4">{sub.category?.name || "—"}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(sub)}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No subcategories found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: Math.min(maxPagesToShow, totalPages) }, (_, idx) => {
              const page = startPage + idx;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded ${currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
