// src/components/SEO.jsx
import { useEffect } from "react";

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
  
  useEffect(() => {
    // Set title
    document.title = title || "Universal Combo - Mobile Spare Parts";
    
    // Helper function to update or create meta tag
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement("meta");
        if (property) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    
    // Update or create meta tags
    updateMetaTag("description", description || defaultDescription);
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }
    
    // Open Graph tags
    updateMetaTag("og:title", title || "Universal Combo", true);
    updateMetaTag("og:description", description || defaultDescription, true);
    updateMetaTag("og:type", type, true);
    if (url) updateMetaTag("og:url", url, true);
    updateMetaTag("og:image", image || defaultImage, true);
    updateMetaTag("og:site_name", "Universal Combo", true);
    
    // Twitter cards
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title || "Universal Combo");
    updateMetaTag("twitter:description", description || defaultDescription);
    updateMetaTag("twitter:image", image || defaultImage);
    
    // Canonical URL
    if (url) {
      let canonical = document.querySelector("link[rel='canonical']");
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", url);
    }
    
    // Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector("script[type='application/ld+json']");
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, url, image, type, structuredData, defaultDescription, defaultImage]);
  
  return null; // This component doesn't render anything
}
