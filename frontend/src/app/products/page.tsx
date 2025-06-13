// app/products/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import ProductsContent from "./ProductsContent";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";

function ProductsLoading() {
  return (
    <div className="mx-auto px-4 py-8">
      <Container>
        <div className="animate-pulse space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded w-full md:w-96"></div>
          </div>

          {/* Brand Filter Loading */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-32 mr-2"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-18"></div>
            </div>
          </div>

          {/* Products Grid Loading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ProductsLoading />;
  }

  return (
    <Suspense fallback={<ProductsLoading />}>
      <Container>
        <ProductsContent />
      </Container>
    </Suspense>
  );
}
