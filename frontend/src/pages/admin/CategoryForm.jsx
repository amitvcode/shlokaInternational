import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { FaTrashAlt, FaPlus, FaEdit, FaTimes } from "react-icons/fa";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);

  useEffect(() => {
    fetchMainCategories();
    fetchCategories();
  }, []);

  const fetchMainCategories = async () => {
    try {
      const res = await API.get("/main-categories");
      setMainCategories(res.data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("Category name is required!");
    if (!mainCategory) return alert("Please select a main category!");

    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, { name, mainCategory });
        alert("Category updated successfully!");
      } else {
        await API.post("/categories", { name, mainCategory });
        alert("Category created successfully!");
      }

      setName("");
      setMainCategory("");
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Error saving category!");
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setMainCategory(cat.mainCategory?._id || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setMainCategory("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await API.delete(`/categories/${id}`);
      alert("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Error deleting category!");
    }
  };

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Category Management
      </h2>

      {/* --- Category Form --- */}
      <div className="bg-white shadow-lg rounded-2xl p-8 mb-10 border border-gray-100">
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-gray-700">
              Main Category
            </label>
            <select
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="">Select Main Category</option>
              {mainCategories.map((mc) => (
                <option key={mc._id} value={mc._id}>
                  {mc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold shadow-md transition-all ${
                editingId
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {editingId ? (
                <>
                  <FaEdit /> Update
                </>
              ) : (
                <>
                  <FaPlus /> Add
                </>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center justify-center px-4 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-xl shadow-md"
              >
                <FaTimes /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- Category Table --- */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white sticky top-0">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold">#</th>
              <th className="px-6 py-3 text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-sm font-semibold">Main Category</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.length > 0 ? (
              currentCategories.map((cat, index) => (
                <tr
                  key={cat._id}
                  className="hover:bg-indigo-50 transition border-b last:border-none"
                >
                  <td className="px-6 py-4">
                    {indexOfFirstCategory + index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {cat.mainCategory?.name || "—"}
                  </td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
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
                  className="text-center py-6 text-gray-400 text-sm"
                >
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination --- */}
      {categories.length > categoriesPerPage && (
        <div className="flex justify-center items-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
