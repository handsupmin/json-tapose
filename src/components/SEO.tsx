import React, { useEffect } from "react";

/**
 * Props for the SEO component
 *
 * @property title - Page title (defaults to DEFAULT_TITLE)
 * @property description - Page description (defaults to DEFAULT_DESCRIPTION)
 * @property keywords - Meta keywords (defaults to DEFAULT_KEYWORDS)
 * @property image - Open Graph image URL (defaults to DEFAULT_IMAGE)
 * @property url - Canonical URL (defaults to DEFAULT_URL)
 */
interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

/**
 * Default SEO values for the application
 * These values are used when no props are provided
 */
const DEFAULT_TITLE = "JSONtapose - Secure JSON Comparison Tool";
const DEFAULT_DESCRIPTION =
  "JSONtapose is a powerful JSON comparison tool that visualizes differences between two JSON objects in a side-by-side view. Compare, format and analyze JSON data easily.";
const DEFAULT_KEYWORDS =
  "JSON, compare JSON, JSON diff, JSON comparison, JSON tools, JSON validator, JSON formatter, online JSON tool";
const DEFAULT_IMAGE = "https://www.jsontapose.com/og-image.png";
const DEFAULT_URL = "https://www.jsontapose.com/";

/**
 * Updates or creates a meta tag in the document head
 *
 * @param name - Meta tag name or property
 * @param content - Meta tag content
 * @param attributeName - Attribute to use (name or property)
 */
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

/**
 * Updates or creates the canonical URL link tag
 *
 * @param href - Canonical URL
 */
const updateCanonicalLink = (href: string) => {
  let linkTag = document.querySelector('link[rel="canonical"]');

  if (!linkTag) {
    linkTag = document.createElement("link");
    linkTag.setAttribute("rel", "canonical");
    document.head.appendChild(linkTag);
  }

  linkTag.setAttribute("href", href);
};

/**
 * Updates or creates structured data script tag
 *
 * @param data - JSON-LD structured data object
 */
const updateStructuredData = (data: object) => {
  let scriptTag = document.querySelector('script[type="application/ld+json"]');

  if (!scriptTag) {
    scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "application/ld+json");
    document.head.appendChild(scriptTag);
  }

  scriptTag.textContent = JSON.stringify(data);
};

/**
 * Creates schema.org structured data for the application
 *
 * @param description - Application description
 * @param url - Application URL
 * @returns JSON-LD structured data object
 */
const createSchemaData = (description: string, url: string) => ({
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
    url: "https://github.com/handsupmin/json-tapose",
  },
});

/**
 * SEO Component
 *
 * Manages SEO-related meta tags and structured data for the application.
 * Features:
 * - Dynamic meta tag updates
 * - Open Graph protocol support
 * - Twitter card support
 * - Canonical URL management
 * - Schema.org structured data
 *
 * The component:
 * - Updates meta tags on mount and prop changes
 * - Handles SEO for social media sharing
 * - Provides structured data for search engines
 * - Maintains consistent branding across platforms
 *
 * Note: This is a headless component that doesn't render any UI
 */
const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url = DEFAULT_URL,
}) => {
  useEffect(() => {
    // Update basic meta tags for search engines
    document.title = title;
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Update Open Graph tags for social media sharing
    updateMetaTag("og:type", "website", "property");
    updateMetaTag("og:url", url, "property");
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", image, "property");

    // Update Twitter card tags for Twitter sharing
    updateMetaTag("twitter:card", "summary_large_image", "property");
    updateMetaTag("twitter:url", url, "property");
    updateMetaTag("twitter:title", title, "property");
    updateMetaTag("twitter:description", description, "property");
    updateMetaTag("twitter:image", image, "property");

    // Update canonical URL for search engines
    updateCanonicalLink(url);

    // Update structured data for rich search results
    const schemaData = createSchemaData(description, url);
    updateStructuredData(schemaData);

    // No cleanup needed - meta data should persist during page transitions
  }, [title, description, keywords, image, url]);

  // Headless component - no UI rendering
  return null;
};

export default SEO;
