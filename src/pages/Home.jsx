import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import Footer from "../components/userComponents/Footer";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import SEO from "../components/SEO";
import { getBlogs } from "../api/blogs";
import "../assets/home.css";

export default function Home() {
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get("/brands");
      if (Array.isArray(res.data)) {
        setBrands(res.data);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const data = await getBlogs(false); // Get only active blogs
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoadingBlogs(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* SEO */}
      <SEO
        title="Universal Combo | Mobile Spare Parts & Combo Displays – New Universal Combo List 2025"
        description="Explore the Universal Combo list 2025 – your go-to universal combo website for mobile spare parts, displays, and tools. Trusted by technicians, shop owners, and repair professionals."
        keywords="universal combo list,new universal combo list 2025,universal combo website,best universal for universal combo list,universal combo list 2025,universal combo modal list,universal combo list website,best universal combo website mobile combo,mobile spare parts,repair tools"
        url="https://universalcombo.com/"
        image="https://universalcombo.com/UniversalCombo.jpg"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Universal Combo",
          "url": "https://universalcombo.com/",
          "description": "Universal Combo - Your knowledge hub for mobile spare parts",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://universalcombo.com/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />

      {/* Header */}
      <Header />

      {/* Hero Section - Mobile Optimized */}
      <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 sm:space-y-6 animate-fade-in">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight px-2">
              Perfect <span className="bg-gradient-to-r from-cyan-400 to-orange-400 text-transparent bg-clip-text">Solution</span> for{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-orange-400 text-transparent bg-clip-text">Mobile Technicians</span>,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-orange-400 text-transparent bg-clip-text">Shop Owners</span>, and{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-orange-400 text-transparent bg-clip-text">Staff</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
              Your comprehensive knowledge hub for mobile spare parts, repair guides, and universal combo compatibility. 
              Trusted by professionals across the industry.
            </p>
            
            {/* Search Bar - Mobile Full Width */}
            <div className="flex justify-center pt-4 sm:pt-6 w-full max-w-2xl mx-auto px-2">
              <div className="w-full transform transition-all duration-300 sm:hover:scale-105">
                <SearchBar
                  search={search}
                  setSearch={setSearch}
                  endpoint="/api/products/search"
                  linkBuilder={(item) => `/product/${item._id}`}
                  type="models"
                />
              </div>
            </div>

            {/* Quick Stats - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-8 max-w-4xl mx-auto px-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-md">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{brands.length}+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Brands</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-md">
                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">1000+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Products</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-md">
                <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{blogs.length}+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Blogs</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-md">
                <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section - Mobile Optimized */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Explore by <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Brand</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
              Browse spare parts and universal combos for your favorFind Universal Combo and Spare Parts According to Mobile Brands.ite mobile brands
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
              <p className="text-sm sm:text-base">No brands available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {brands.map((brand, index) => {
                const slug = slugify(brand.name, { lower: true });
                return (
                  <article
                    key={brand._id}
                    onClick={() => navigate(`/models/${slug}/${brand._id}`)}
                    className="group cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg sm:rounded-xl shadow-md hover:shadow-2xl active:scale-95 transition-all duration-300 sm:transform sm:hover:-translate-y-2 p-3 sm:p-4 md:p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 min-h-[80px] sm:min-h-[140px] touch-manipulation"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Mobile Layout - One brand per row */}
                    <div className="flex items-center justify-between w-full sm:hidden">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-md">
                          {brand.name.charAt(0)}
                        </div>
                        <h3 className="text-sm font-semibold dark:text-white">{brand.name}</h3>
                      </div>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0">
                        →
                      </span>
                    </div>
                    {/* Desktop Layout */}
                    <div className="hidden sm:flex flex-col items-center w-full">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl mb-2 md:mb-3 shadow-lg group-hover:scale-110 transition-transform">
                        {brand.name.charAt(0)}
                      </div>
                      <h3 className="text-sm md:text-base font-semibold dark:text-white mb-1 md:mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-center">
                        {brand.name}
                      </h3>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Spare Parts →
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features/Benefits Section - Mobile Optimized */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Why Choose <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">Universal Combo</span>?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Everything you need for mobile repair and spear parts <b>Knowledge</b> in one place.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: "🔍", title: "Easy Search", desc: "Find universal combo with our advanced search" },
              { icon: "📱", title: "All Brands", desc: "Support for all major mobile brands" },
              { icon: "📚", title: "Knowledge Base", desc: "Comprehensive guides and tutorials" },
              { icon: "⚡", title: "Fast Access", desc: "Quick access to compatibility information" }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 sm:transform sm:hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section - Mobile Optimized */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
            Trusted by Industry Leaders
          </h2>
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 px-2 max-w-5xl">
              {["Kajoni Power", "Techno Hub", "RepairMart", "MobileFix"].map((company, index) => {
                const slug = slugify(company.toLowerCase());
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[calc(50%-0.375rem)] sm:w-36 md:w-40 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl p-3 sm:p-4 md:p-6 text-center transition-all duration-300 sm:transform sm:hover:-translate-y-1 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg mb-2 sm:mb-3 shadow-lg">
                      {company.charAt(0)}
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base font-semibold dark:text-white break-words">
                      {company}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section - Mobile Optimized */}
      {blogs.length > 0 && (
        <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  Latest <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Blogs</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Stay updated with the latest insights and tips
                </p>
              </div>
              {blogs.length > 5 && (
                <button
                  onClick={() => navigate("/blogs")}
                  className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-2 transition-colors touch-manipulation min-h-[44px]"
                  aria-label="View all blogs"
                >
                  View All <span className="text-lg sm:text-xl">→</span>
                </button>
              )}
            </div>
            {loadingBlogs ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Mobile: Show 1-2 blogs */}
                <div className="grid grid-cols-1 gap-6 md:hidden">
                  {blogs.slice(0, 2).map((blog) => (
                    <article
                      key={blog._id}
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 cursor-pointer active:scale-95 touch-manipulation"
                    >
                      {blog.image && (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-56 object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "/UniversalCombo.jpg";
                          }}
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                          {blog.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                {/* Desktop: Show 4-5 blogs */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {blogs.slice(0, 5).map((blog) => (
                    <article
                      key={blog._id}
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 group cursor-pointer"
                    >
                      {blog.image && (
                        <div className="overflow-hidden">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "/UniversalCombo.jpg";
                            }}
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                          {blog.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                {/* View All button for mobile if more than 2 blogs */}
                {blogs.length > 2 && (
                  <div className="md:hidden text-center mt-6">
                    <button
                      onClick={() => navigate("/blogs")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 active:from-blue-700 active:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg active:scale-95 touch-manipulation min-h-[44px] w-full max-w-xs mx-auto"
                      aria-label={`View all ${blogs.length} blogs`}
                    >
                      View All Blogs ({blogs.length})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Subscription Section - Mobile Optimized */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 dark:from-gray-800 dark:to-gray-900 text-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white opacity-10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white opacity-10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
                Join Our Premium Subscription
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-100 max-w-2xl mx-auto leading-relaxed px-2">
                Unlock exclusive access to{" "}
                <span className="font-bold text-green-200">
                  Universal Combo list 2025
                </span> knowledge. Get insights, updates, and premium benefits only for members.
              </p>
              
              {/* Benefits - Mobile Stack */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-2xl mx-auto">
                {["Premium Content", "Expert Guides", "Priority Support"].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg p-2 sm:p-3 backdrop-blur-sm w-full">
                    <span className="text-lg sm:text-xl flex-shrink-0">✓</span>
                    <span className="text-xs sm:text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                className="bg-white active:bg-gray-100 text-green-600 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-xl transition-all duration-300 active:scale-95 text-base sm:text-lg touch-manipulation min-h-[48px] w-full sm:w-auto"
                onClick={() => localStorage.getItem("token") ? navigate("/subscribe") : navigate("/login")}
                aria-label="Subscribe to premium membership"
              >
                Subscribe Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
