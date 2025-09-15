// app/sitemap.ts
import type { MetadataRoute } from "next";

// Helper function to safely create a date
function getValidDate(dateString?: string | Date | null): Date {
  if (!dateString) return new Date();

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sbckenya.com/";
  const currentDate = new Date();

  // Static routes (what you know exists)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}partner`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}brands`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}news`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}products`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}contact`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}careers`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  const brands = [
    "Pepsi",
    "Mirinda",
    "Evervess",
    "sting",
    "Aquafina",
    "7up",
    "Mountain+Dew",
  ];
  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}products?brand=${encodeURIComponent(brand)}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Use the full URL for server-side fetching
    const productsResponse = await fetch(`${baseUrl}api/products`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    });
    if (!productsResponse.ok) {
      console.error("Products API error:", await productsResponse.text());
      throw new Error(`Products API returned ${productsResponse.status}`);
    }

    const products = await productsResponse.json();

    // Handle both array and object with results property
    const productsList = Array.isArray(products)
      ? products
      : products?.results || [];

    const productRoutes: MetadataRoute.Sitemap = productsList
      .map((product: any) => {
        // Ensure we have a valid slug or id for the URL
        const productSlug = product.slug || product.id;
        if (!productSlug) {
          console.warn("Product missing slug and id:", product);
          return null;
        }

        return {
          url: `${baseUrl}products/${productSlug}`,
          lastModified: product.updated_at
            ? new Date(product.updated_at)
            : currentDate,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;

    const newsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}news/api/news/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        next: { revalidate: 3600 },
      }
    );

    if (!newsResponse.ok) {
      console.error("News API error:", await newsResponse.text());
      throw new Error(`News API returned ${newsResponse.status}`);
    }

    const news = await newsResponse.json();
    const newsData = news.results || [];

    const newsRoutes: MetadataRoute.Sitemap = newsData.map((article: any) => ({
      url: `${baseUrl}news/${article.id}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    dynamicRoutes = [...productRoutes, ...newsRoutes];
  } catch (error) {
    console.error("Failed to fetch dynamic routes:", error);
  }

  const allRoutes = [...staticRoutes, ...brandRoutes, ...dynamicRoutes];

  return allRoutes;
}
