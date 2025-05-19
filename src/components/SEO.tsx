import React, { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "JSONtapose - Modern JSON Comparison Tool",
  description = "JSONtapose is a powerful JSON comparison tool that visualizes differences between two JSON objects in a side-by-side view. Compare, format and analyze JSON data easily.",
  keywords = "JSON, compare JSON, JSON diff, JSON comparison, JSON tools, JSON validator, JSON formatter, online JSON tool",
  image = "https://json-tapose.vercel.app/og-image.png",
  url = "https://json-tapose.vercel.app/",
}) => {
  useEffect(() => {
    // 기본 메타 태그 업데이트
    document.title = title;

    // 기존 메타 태그 업데이트 또는 생성
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Open Graph 태그
    updateMetaTag("og:type", "website", "property");
    updateMetaTag("og:url", url, "property");
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", image, "property");

    // Twitter 태그
    updateMetaTag("twitter:card", "summary_large_image", "property");
    updateMetaTag("twitter:url", url, "property");
    updateMetaTag("twitter:title", title, "property");
    updateMetaTag("twitter:description", description, "property");
    updateMetaTag("twitter:image", image, "property");

    // 정식 URL 업데이트
    updateCanonicalLink(url);

    // 스키마 구조화 데이터 추가
    const schemaData = {
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
    };

    updateStructuredData(schemaData);

    // 컴포넌트 언마운트 시 정리 함수는 필요 없음 (페이지 전환시에도 메타 데이터는 유지되어야 함)
  }, [title, description, keywords, image, url]);

  // 메타 태그 업데이트 또는 생성하는 헬퍼 함수
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

  // 정식 URL 업데이트 또는 생성하는 헬퍼 함수
  const updateCanonicalLink = (href: string) => {
    let linkTag = document.querySelector('link[rel="canonical"]');

    if (!linkTag) {
      linkTag = document.createElement("link");
      linkTag.setAttribute("rel", "canonical");
      document.head.appendChild(linkTag);
    }

    linkTag.setAttribute("href", href);
  };

  // 구조화 데이터 업데이트 또는 생성하는 헬퍼 함수
  const updateStructuredData = (data: object) => {
    let scriptTag = document.querySelector(
      'script[type="application/ld+json"]'
    );

    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = JSON.stringify(data);
  };

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
};

export default SEO;
