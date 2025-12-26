import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById } from "../../api/blogs";
import Header from "../../components/Header";
import Footer from "../../components/userComponents/Footer";
import SEO from "../../components/SEO";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Blog not found.</p>
          <button
            onClick={() => navigate("/blogs")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO
        title={`${blog.title} | Universal Combo Blog`}
        description={blog.description}
        keywords={`${blog.title}, mobile spare parts, universal combo, blog`}
        url={`https://universalcombo.com/blog/${blog._id}`}
        image={blog.image || "https://universalcombo.com/UniversalCombo.jpg"}
      />

      <Header />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/blogs")}
            className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 transition-colors"
          >
            <span>←</span> Back to Blogs
          </button>

          {/* Blog Content */}
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 sm:h-96 object-cover"
                onError={(e) => {
                  e.target.src = "/UniversalCombo.jpg";
                }}
              />
            )}
            <div className="p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {blog.title}
              </h1>
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                  {blog.description}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}

