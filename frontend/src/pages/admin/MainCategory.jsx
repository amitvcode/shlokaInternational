import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { FaTrashAlt, FaPlus, FaEdit } from "react-icons/fa";

export default function MainCategory() {
  const [mainCategoryName, setMainCategoryName] = useState("");
  const [mainCategories, setMainCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMainCategories();
  }, []);

  const fetchMainCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get("/main-categories");
      console.log("Fetched data:", res.data); // 🔍 Debug log
      
      // Backend returns { success: true, categories: [...] }
      if (res.data.success && res.data.categories) {
        setMainCategories(res.data.categories);
      } else {
        console.error("Unexpected response structure:", res.data);
        setMainCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
      alert("Failed to fetch categories. Check console for details.");
      setMainCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainCategoryName.trim()) {
      return alert("Main category name is required!");
    }

    try {
      if (editingId) {
        const res = await API.put(`/main-categories/${editingId}`, {
          name: mainCategoryName,
        });
        console.log("Update response:", res.data); // 🔍 Debug log
        alert("Main category updated successfully!");
      } else {
        const res = await API.post("/main-categories", { 
          name: mainCategoryName 
        });
        console.log("Create response:", res.data); // 🔍 Debug log
        alert("Main category created successfully!");
      }

      setMainCategoryName("");
      setEditingId(null);
      fetchMainCategories();
    } catch (error) {
      console.error("Error saving:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error saving main category!");
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setMainCategoryName(cat.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this main category?"))
      return;

    try {
      await API.delete(`/main-categories/${id}`);
      alert("Main category deleted successfully!");
      fetchMainCategories();
    } catch (error) {
      console.error("Error deleting:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error deleting main category!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <h2 className="text-4xl font-extrabold text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 mb-8">
        Main Categories
      </h2>

      {/* Form Card */}
      <div className="bg-white shadow-xl rounded-3xl p-8 mb-8 transform hover:scale-[1.01] transition-all duration-300">
        <form
          className="flex flex-col md:flex-row gap-4 items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Enter main category name"
            value={mainCategoryName}
            onChange={(e) => setMainCategoryName(e.target.value)}
            className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
          />
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 justify-center px-6 py-4 rounded-xl text-white font-bold shadow-lg transition transform hover:-translate-y-0.5 ${
              editingId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {editingId ? "Update" : "Add"} {editingId ? "" : <FaPlus />}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setMainCategoryName("");
              }}
              className="px-6 py-4 rounded-xl bg-gray-400 hover:bg-gray-500 text-white font-bold shadow-lg transition transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-xl rounded-3xl overflow-auto max-h-[450px]">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left font-medium">
                  Main Category Name
                </th>
                <th className="px-6 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mainCategories.length > 0 ? (
                mainCategories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-indigo-50 transition-all duration-200 border-b last:border-b-0"
                  >
                    <td className="px-6 py-4">{cat.name}</td>
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
                  <td colSpan="2" className="text-center py-6 text-gray-400">
                    No main categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
