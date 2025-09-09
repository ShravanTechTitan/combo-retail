import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";

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
        <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (!product)
    return <div className="p-6 text-gray-500">Product not found.</div>;

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-6">
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
    {/* Product Name + Category */}
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{product.name}{product.modelIds[0]?.name}</h1>
      {product.partCategoryId?.name && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Category: {product.partCategoryId.name}
        </p>
      )}
    </div>

    {/* Price */}
    <div className="text-2xl font-semibold text-indigo-600">
      ₹{product.price}
    </div>

    {/* Description */}
    {product.description && (
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {product.description}
      </p>
    )}

    {/* Brands */}
    {product.brandIds?.length > 0 && (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Brand(s)
        </h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
          {product.brandIds.map((brand, i) => (
            <li key={i}>{brand.name || brand}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Supported Models */}
    {product.modelIds?.length > 0 && (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Supported Models
        </h2>
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
