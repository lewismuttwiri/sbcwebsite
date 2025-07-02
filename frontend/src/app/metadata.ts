import { Metadata, Viewport } from "next";

const siteName = "SBC Kenya | Pepsi Kenya";
const siteDescription =
  "Official website of SBC Kenya | Pepsi Kenya, the authorized Pepsi bottling company in Kenya. Explore our range of beverages including Pepsi, Mountain Dew, 7UP, Mirinda, and more.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sbc-kenya.com";
const twitterHandle = "@SBCKenya";

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateMetadata({
  title,
  description = siteDescription,
  path = "/",
  image = "/images/og-image.jpg",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: GenerateMetadataProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageUrl = `${siteUrl}${path}`;
  const ogImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description: description,
    keywords: [
      "Pepsi Kenya",
      "SBC Kenya",
      "Pepsi bottling company",
      "soft drinks Kenya",
      "Mountain Dew Kenya",
      "7UP Kenya",
      "Mirinda Kenya",
      "beverages Kenya",
      "soft drink manufacturer Kenya",
      "refreshing drinks Kenya",
      ...tags,
    ],
    authors: [{ name: author || "SBC Kenya" }],
    creator: "SBC Kenya",
    publisher: "SBC Kenya",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: pageTitle,
      description: description,
      url: pageUrl,
      siteName: siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: "en_KE",
      type,
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags: tags.length > 0 ? tags : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: description,
      images: [ogImage],
      creator: twitterHandle,
      site: twitterHandle,
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0046BE", // Pepsi blue
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = generateMetadata();
