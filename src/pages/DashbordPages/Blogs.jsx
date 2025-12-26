import { useEffect, useState } from "react";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "../../api/blogs";
import ConfirmDialog from "../../components/dashboardComponents/ConfirmDialog";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9, // 3x3 grid
    total: 0,
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    isActive: true,
    order: 0,
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogs(true); // Get all blogs for admin
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Apply pagination
  useEffect(() => {
    setPagination((prev) => ({ ...prev, total: blogs.length }));
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    setFilteredBlogs(blogs.slice(start, end));
  }, [blogs, pagination.page, pagination.limit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateBlog(editingId, form);
      } else {
        await createBlog(form);
      }
      setShowModal(false);
      setForm({ title: "", description: "", image: "", isActive: true, order: 0 });
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Error saving blog. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setForm({
      title: blog.title,
      description: blog.description,
      image: blog.image,
      isActive: blog.isActive,
      order: blog.order || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBlog(deleteId);
      setConfirmOpen(false);
      setDeleteId(null);
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Error deleting blog. Please try again.");
    }
  };

  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", image: "", isActive: true, order: 0 });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Add Blog
        </button>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No blogs found. Add your first blog!
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/UniversalCombo.jpg";
                  }}
                />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                    {blog.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      blog.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {blog.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                  {blog.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(blog._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} blogs
                </div>
                
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => {
                      const newLimit = parseInt(e.target.value);
                      setPagination({ ...pagination, limit: newLimit, page: 1 });
                    }}
                    className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="9">9</option>
                    <option value="18">18</option>
                    <option value="27">27</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="500">500</option>
                  </select>
                  <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
                </div>
              </div>
              
              {pagination.total > pagination.limit && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  
                  {/* Page Number Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Page</span>
                    <input
                      type="number"
                      min="1"
                      max={Math.ceil(pagination.total / pagination.limit)}
                      value={pagination.page}
                      onChange={(e) => {
                        const pageNum = parseInt(e.target.value);
                        if (pageNum >= 1 && pageNum <= Math.ceil(pagination.total / pagination.limit)) {
                          setPagination({ ...pagination, page: pageNum });
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const pageNum = parseInt(e.target.value);
                          const maxPage = Math.ceil(pagination.total / pagination.limit);
                          if (pageNum >= 1 && pageNum <= maxPage) {
                            setPagination({ ...pagination, page: pageNum });
                          } else {
                            alert(`Please enter a page number between 1 and ${maxPage}`);
                          }
                        }
                      }}
                      className="w-16 px-2 py-2 text-center border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      of {Math.ceil(pagination.total / pagination.limit)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingId ? "Edit Blog" : "Add New Blog"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter blog title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter blog description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="mt-2 w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order (for sorting)
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Active (show on homepage)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
      />
    </div>
  );
}

