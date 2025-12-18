import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import Header from "../../components/Header";
import SEO from "../../components/SEO"; // Create this reusable component

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (!product)
    return <div className="p-6 text-gray-500 dark:text-gray-300">Product not found.</div>;

  return (
    <>
      <SEO
        title={`${product.name} | Universal Combo Spare Parts`}
        description={`Buy ${product.name} including ${product.partCategoryId?.name || "spare parts"} from Universal Combo. Trusted source for technicians and shops.`}
        keywords={`${product.name}, ${product.partCategoryId?.name || ""}, mobile spare parts, universal combo`}
        url={`https://universalcombo.com/product/${product._id}`}
        image="https://universalcombo.com/UniversalCombo.jpg"
        type="product"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": product.description || `Universal ${product.partCategoryId?.name || "spare part"} for ${product.brandIds?.map(b => b.name).join(", ") || "mobile devices"}`,
          "category": product.partCategoryId?.name,
          "brand": product.brandIds?.length > 0 ? {
            "@type": "Brand",
            "name": product.brandIds[0].name
          } : undefined
        }}
      />

      <Header />

      <div className="max-w-5xl mx-auto p-6 mt-15">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 space-y-6 transition-all duration-300 hover:shadow-xl">
          
          {/* Product Title */}
          <div className="space-y-2">
            <h1 className="lg:text-xl sm:text-xl font-bold text-gray-900 dark:text-white">{product.name} {product.modelIds[0]?.name} {product.partCategoryId.name}</h1>
            {product.partCategoryId?.name && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Category: {product.partCategoryId.name}
              </p>
            )}
          </div>

      

          {/* Description */}
          {product.description && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Brands */}
          {product.brandIds?.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Brand(s)</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {product.brandIds.map((brand, i) => (
                  <li key={i}>{brand.name || brand}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Supported Models */}
          {product.modelIds?.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Supported Models</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {product.modelIds.map((model, i) => (
                  <li key={i}>{model.name || model}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
