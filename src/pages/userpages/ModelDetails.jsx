import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import FilterSearchBar from "../../components/FilterSearchBar";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import slugify from "slugify";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi";
import * as AiIcons from "react-icons/ai";
import * as CiIcons from "react-icons/ci";
import * as ImIcons from "react-icons/im";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as GiIcons from "react-icons/gi";
import * as LuIcons from "react-icons/lu";



import SEO from "../../components/SEO";

export default function ModelDetails() {
  const [products, setProducts] = useState([]);
  const [partCategories, setPartCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const allIcons = {
    ...FaIcons,
    ...MdIcons,
    ...BiIcons,
    ...AiIcons,
    ...CiIcons,
    ...ImIcons,
    ...IoIcons,
    ...RiIcons,
    ...GiIcons,
    ...LuIcons,
  };
  

  const { brand, brandId } = useParams();
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/products/${brand}/${brandId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [brand, brandId]);

  // Extract categories
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [
        ...new Map(
          products.map((p) => [p.partCategoryId._id, p.partCategoryId])
        ).values(),
      ];
      setPartCategories(uniqueCategories);
    } else {
      setPartCategories([]);
    }
  }, [products]);

  const filteredCategories = partCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* SEO */}
      <SEO
        title={`${brand} Spare Parts | Universal Combo List 2025`}
        description={`Browse ${brand} spare parts at Universal Combo – displays, batteries, boards, frames & more.`}
        keywords={`${brand} spare parts, ${brand} combo list, universal combo 2025`}
        url={`https://universalcombo.com/models/${brand}/${brandId}`}
        image="https://universalcombo.com/UniversalCombo.jpg"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${brand} Spare Parts`,
          "description": `Browse ${brand} spare parts at Universal Combo`,
          "url": `https://universalcombo.com/models/${brand}/${brandId}`
        }}
      />

      <Header />

      {/* Hero Section */}
      <div className="text-center pt-20 pb-8 px-4">
  <h1 className="lg:text-4xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
    {brand}{" "}
    <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
      Universal Spare Parts
    </span>
  </h1>

  {/* Dynamic Subtitle */}
  <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6">
    Explore <span className="font-semibold">{brand}</span> combo list –{" "}
    {partCategories.length > 0
      ? partCategories.slice(0, 3)
      .map((c) =>"Universal " + c.name).join(", ") + (partCategories.length > 3 ? ", & more" : "")
      : "loading categories..."}.
  </p>
</div>


      {/* Search Bar */}
      <div className="flex justify-center pb-6 px-4">
        <FilterSearchBar
          items={partCategories}
          search={search}
          setSearch={setSearch}
          placeholder="🔍 Search categories..."
          filterKey="name"
        />
      </div>

      <div className="p-6">
        {/* Error */}
        {error && (
          <p className="text-red-500 dark:text-red-400 text-center mb-6 font-medium">
            {error}
          </p>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-cyan-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => {
              const Icon =
                category.icon && allIcons[category.icon]
                  ? allIcons[category.icon]
                  : null;
              const slug = slugify(category.name, { lower: true });

              return (
                <div
                  key={category._id}
                  onClick={() =>
                    navigate(`/models/${brand}/${brandId}/${slug}/${category._id}`)
                  }
                  className="cursor-pointer rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 
                             bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                             border border-transparent hover:border-blue-400 p-5"
                >
                  {/* Mobile Layout */}
                  <div className="flex sm:hidden items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-gray-800 dark:text-white text-base font-semibold shadow-sm">
  {Icon ? <Icon className="w-5 h-5" /> : <span>{category.name.charAt(0).toUpperCase()}</span>}
</div>



                      <h3 className="text-sm font-semibold dark:text-white">
                        {category.name}
                      </h3>
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      View →
                    </span>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg  flex items-center justify-center text-gray-800 dark:text-white text-xl mb-3 shadow-sm">
  {Icon ? <Icon className="w-5 h-5" /> : <span>{category.name.charAt(0).toUpperCase()}</span>}
</div>

                    <h3 className="text-base font-semibold dark:text-white mb-1 capitalize">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Explore Universal {category.name}
                    </p>
                  </div>
                </div>
              );
            })}

            {filteredCategories.length === 0 && !loading && (
              <p className="col-span-full text-gray-500 dark:text-gray-400 text-center mt-6">
                No categories match your search.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
