import React, { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

// Constants for default values
const DEFAULT_TITLE = "JSONtapose - Modern JSON Comparison Tool";
const DEFAULT_DESCRIPTION =
  "JSONtapose is a powerful JSON comparison tool that visualizes differences between two JSON objects in a side-by-side view. Compare, format and analyze JSON data easily.";
const DEFAULT_KEYWORDS =
  "JSON, compare JSON, JSON diff, JSON comparison, JSON tools, JSON validator, JSON formatter, online JSON tool";
const DEFAULT_IMAGE = "https://json-tapose.vercel.app/og-image.png";
const DEFAULT_URL = "https://json-tapose.vercel.app/";

// Helper function to update or create meta tags
const updateMetaTag = (
  name: string,
  content: string,
  attributeName: string = "name"
) => {
  let metaTag = document.querySelector(`meta[${attributeName}="${name}"]`);

  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.setAttribute(attributeName, name);
    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute("content", content);
};

// Helper function to update or create canonical URL
const updateCanonicalLink = (href: string) => {
  let linkTag = document.querySelector('link[rel="canonical"]');

  if (!linkTag) {
    linkTag = document.createElement("link");
    linkTag.setAttribute("rel", "canonical");
    document.head.appendChild(linkTag);
  }

  linkTag.setAttribute("href", href);
};

// Helper function to update or create structured data
const updateStructuredData = (data: object) => {
  let scriptTag = document.querySelector('script[type="application/ld+json"]');

  if (!scriptTag) {
    scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "application/ld+json");
    document.head.appendChild(scriptTag);
  }

  scriptTag.textContent = JSON.stringify(data);
};

// Function to create schema data
const createSchemaData = (title: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSONtapose",
  description: description,
  url: url,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "handsupmin",
    url: "https://github.com/handsupmin",
  },
});

const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url = DEFAULT_URL,
}) => {
  useEffect(() => {
    // Update basic meta tags
    document.title = title;
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Update Open Graph tags
    updateMetaTag("og:type", "website", "property");
    updateMetaTag("og:url", url, "property");
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", image, "property");

    // Update Twitter tags
    updateMetaTag("twitter:card", "summary_large_image", "property");
    updateMetaTag("twitter:url", url, "property");
    updateMetaTag("twitter:title", title, "property");
    updateMetaTag("twitter:description", description, "property");
    updateMetaTag("twitter:image", image, "property");

    // Update canonical URL
    updateCanonicalLink(url);

    // Update structured data
    const schemaData = createSchemaData(title, description, url);
    updateStructuredData(schemaData);

    // No cleanup function needed as meta data should persist during page transitions
  }, [title, description, keywords, image, url]);

  // This component doesn't render any UI
  return null;
};

export default SEO;
