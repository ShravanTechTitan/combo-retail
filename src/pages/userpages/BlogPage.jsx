import { useEffect, useState } from "react";
import { getBlogs } from "../../api/blogs";
import Header from "../../components/Header";
import Footer from "../../components/userComponents/Footer";
import SEO from "../../components/SEO";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await getBlogs(false); // Get only active blogs
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO
        title="Blogs | Universal Combo - Mobile Spare Parts Knowledge"
        description="Read our latest blogs about mobile spare parts, repair tips, and industry insights at Universal Combo."
        keywords="mobile spare parts blog, repair tips, mobile repair knowledge, universal combo blog"
        url="https://universalcombo.com/blogs"
        image="https://universalcombo.com/UniversalCombo.jpg"
      />

      <Header />

      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Blogs</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Stay updated with the latest insights, tips, and knowledge about mobile spare parts and repairs
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No blogs available at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Layout: 1 column */}
              <div className="grid grid-cols-1 gap-6 md:hidden">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    onClick={() => window.open(`/blog/${blog._id}`, '_blank')}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700 active:scale-95 touch-manipulation"
                  >
                    {blog.image && (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.src = "/UniversalCombo.jpg";
                        }}
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-4">
                        {blog.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Desktop Layout: 2-3 columns */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    onClick={() => window.open(`/blog/${blog._id}`, '_blank')}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-200 dark:border-gray-700 group"
                  >
                    {blog.image && (
                      <div className="overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/UniversalCombo.jpg";
                          }}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-4">
                        {blog.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

