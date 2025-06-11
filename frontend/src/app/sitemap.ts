// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sbckenya.com";

  // Static routes (what you know exists)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/partner`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
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
  const brandRoutes = brands.map((brand) => ({
    url: `${baseUrl}/products?brand=${encodeURIComponent(brand)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const productsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );
    const products = await productsResponse.json();

    const productRoutes =
      products.results?.map((product: any) => ({
        url: `${baseUrl}/products/${encodeURIComponent(product.slug)}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })) || [];

    const newsResponse = await fetch(`/api/news`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      next: { revalidate: 3600 },
    });

    const news = await newsResponse.json();
    const newsData = news.results;
    console.log("newsData", newsData);
    console.log("news", news);

    const newsRoutes =
      newsData?.map((article: any) => ({
        url: `${baseUrl}/news/${encodeURIComponent(article.slug)}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })) || [];

    dynamicRoutes = [...productRoutes, ...newsRoutes];
  } catch (error) {
    console.error("Failed to fetch dynamic routes:", error);
  }

  return [...staticRoutes, ...brandRoutes, ...dynamicRoutes];
}
