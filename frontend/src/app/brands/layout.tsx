import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Brands - SBC",
  description: "Explore our premium selection of brands",
};

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
