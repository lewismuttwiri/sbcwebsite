import { Metadata } from "next";
import { notFound } from "next/navigation";

import products, { Product } from "@/data/brands";
import { generateMetadata as generateSiteMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Find the product by slug
  const product = products.find((p: Product) => p.slug === params.slug);

  if (!product) {
    return generateSiteMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
    });
  }

  // Generate price-related search terms
  const priceTerms = [
    `price of ${product.name} in Kenya`,
    `how much is ${product.name} in Kenya`,
    `${product.name} price in Kenya`,
    `buy ${product.name} online Kenya`,
    `${product.name} cost`,
    `cheap ${product.name}`,
    `${product.name} best price`,
    `where to buy ${product.name} in Kenya`,
  ];

  // Generate common search terms
  const searchTerms = [
    `buy ${product.name} online`,
    `${product.name} Kenya`,
    `${product.brand} ${product.name}`,
    `order ${product.name} online`,
    `${product.name} near me`,
    ...priceTerms,
  ];

  // Generate description with price information
  const priceInfo = product.price 
    ? `Best price KSh ${product.price.toFixed(2)}. ` 
    : '';
  
  const description = `Buy ${product.name} online from SBC Kenya. ${priceInfo}${
    product.description || 
    `Enjoy the refreshing taste of ${product.name} from ${product.brand}. ` +
    `Available for delivery across Kenya.`
  }`;

  return generateSiteMetadata({
    title: `Buy ${product.name} Online - ${product.brand} | SBC Kenya`,
    description: description,
    path: `/products/${product.slug}`,
    image: product.images?.[0]?.src || "/images/og-image.jpg",
    type: "website",
    tags: [
      ...new Set([
        ...searchTerms,
        product.name,
        product.brand,
        product.brandDescription,
        'beverages Kenya',
        'soft drinks Kenya',
        'buy soft drinks online',
        'soft drinks delivery',
        'online beverage store Kenya',
        `price of ${product.quantity} ${product.name}`,
        `buy ${product.quantity} ${product.name} online`,
      ]),
    ],
  });
}
