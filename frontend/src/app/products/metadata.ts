import { Metadata } from "next";
import { generateMetadata as generateSiteMetadata } from "@/app/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata({
    title: "Our Products - SBC Kenya | Pepsi Kenya",
    description: "Explore our wide range of refreshing beverages including Pepsi, Mountain Dew, 7UP, Mirinda, and more. Find your favorite drinks from SBC Kenya.",
    path: "/products",
    type: 'website',
    tags: [
      'Pepsi products Kenya',
      'soft drinks Kenya',
      'beverages Kenya',
      'carbonated drinks',
      'SBC Kenya products',
    ],
  });
}
