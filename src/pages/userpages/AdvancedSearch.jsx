import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import Header from "../../components/Header";
import Footer from "../../components/userComponents/Footer";

export default function AdvancedSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    brandId: searchParams.get("brand") || "",
    categoryId: searchParams.get("category") || "",
    modelId: searchParams.get("model") || "",
    sortBy: searchParams.get("sort") || "relevance",
  });
  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    categories: [],
    models: [],
    allModels: [], // Store all models for filtering
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    if (query || filters.brandId || filters.categoryId || filters.modelId) {
      performSearch();
    }
  }, [query, filters, pagination.page]);

  const fetchFilters = async () => {
    try {
      const res = await api.get("/search/filters");
      setAvailableFilters({
        ...res.data,
        allModels: res.data.models || [], // Store all models
      });
    } catch (err) {
      console.error("Error fetching filters:", err);
    }
  };

  // Filter models based on selected brand
  const filteredModels = filters.brandId
    ? availableFilters.allModels.filter(model => 
        model.brandId?._id === filters.brandId || model.brandId === filters.brandId
      )
    : availableFilters.allModels;

  const performSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 20,
        ...(query && { q: query }),
        ...(filters.brandId && { brandId: filters.brandId }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.modelId && { modelId: filters.modelId }),
        sortBy: filters.sortBy,
      });

      const res = await api.get(`/search/advanced?${params.toString()}`);
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    setSearchParams({
      q: query,
      ...(filters.brandId && { brand: filters.brandId }),
      ...(filters.categoryId && { category: filters.categoryId }),
      ...(filters.modelId && { model: filters.modelId }),
    });
  };

  const clearFilters = () => {
    setFilters({
      brandId: "",
      categoryId: "",
      modelId: "",
      sortBy: "relevance",
    });
    setQuery("");
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                Clear
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Filters</h3>
                
                {/* Brand Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Brand
                  </label>
                  <select
                    value={filters.brandId}
                    onChange={(e) => {
                      setFilters({ 
                        ...filters, 
                        brandId: e.target.value, 
                        modelId: "", // Reset model when brand changes
                        page: 1 
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Brands</option>
                    {availableFilters.brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={filters.categoryId}
                    onChange={(e) => setFilters({ ...filters, categoryId: e.target.value, page: 1 })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {availableFilters.categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Model {filters.brandId && <span className="text-xs text-gray-500">(Filtered by brand)</span>}
                  </label>
                  <select
                    value={filters.modelId}
                    onChange={(e) => setFilters({ ...filters, modelId: e.target.value, page: 1 })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    disabled={filteredModels.length === 0 && filters.brandId}
                  >
                    <option value="">All Models</option>
                    {filteredModels.map((model) => (
                      <option key={model._id} value={model._id}>
                        {model.name} {model.brandId?.name ? `(${model.brandId.name})` : ''}
                      </option>
                    ))}
                  </select>
                  {filters.brandId && filteredModels.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">No models found for selected brand</p>
                  )}
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-gray-600 dark:text-gray-400">
                    Found {pagination.total} products
                  </div>
                  
                  {products.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400">No products found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map((product) => {
                        // Display product name + first model name
                        const firstModel = product.modelIds && product.modelIds.length > 0 
                          ? product.modelIds[0].name 
                          : "";
                        const displayName = firstModel 
                          ? `${product.name} ${firstModel}` 
                          : product.name;
                        
                        return (
                          <div
                            key={product._id}
                            onClick={() => navigate(`/product/${product._id}`)}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition"
                          >
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                              {displayName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {product.brandIds?.map(b => b.name).join(", ")}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                      <button
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

