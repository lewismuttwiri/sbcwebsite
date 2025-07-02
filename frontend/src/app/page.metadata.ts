import { Metadata } from "next";
import { generateMetadata as generateSiteMetadata } from "@/app/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata({
    title: "Home - SBC Kenya | Pepsi Kenya - Official Website",
    description: "Welcome to SBC Kenya, the official Pepsi bottling company in Kenya. Discover our range of refreshing beverages including Pepsi, Mountain Dew, 7UP, Mirinda, and more.",
    path: "/",
    type: 'website',
    tags: [
      'Pepsi Kenya',
      'SBC Kenya',
      'soft drinks Kenya',
      'beverages Kenya',
      'Pepsi products',
      'Mountain Dew Kenya',
      '7UP Kenya',
      'Mirinda Kenya'
    ],
  });
}
