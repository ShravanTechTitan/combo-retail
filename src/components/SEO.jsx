// src/components/SEO.jsx
import { Helmet } from "react-helmet-async";

export default function SEO({ 
  title, 
  description, 
  keywords, 
  url, 
  image,
  type = "website",
  structuredData
}) {
  const defaultImage = "https://universalcombo.com/UniversalCombo.jpg";
  const defaultDescription = "Universal Combo - Your knowledge hub for mobile spare parts. Learn about Samsung, iPhone, Vivo, Oppo, Realme, OnePlus, Mi, Poco spares, compatibility, quality checks, and repair insights.";
  
  return (
    <Helmet>
      <title>{title || "Universal Combo - Mobile Spare Parts"}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph tags */}
      <meta property="og:title" content={title || "Universal Combo"} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content="Universal Combo" />

      {/* Twitter cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || "Universal Combo"} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
