"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard } from "@/components/products";
import type { Product } from "@/utils/productUtils";

export default function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const brandFromUrl = searchParams.get("brand");

  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandFromUrl
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const productsResponse = await fetch("/api/products");
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await productsResponse.json();
        setProducts(products);

        if (brands.length === 0) {
          const brandsResponse = await fetch("/api/brands");
          if (!brandsResponse.ok) {
            throw new Error("Failed to fetch brands");
          }
          const brandsData = await brandsResponse.json();
          setBrands(brandsData);
        }

        let filteredProducts = products;
        if (searchTerm) {
          const searchTermLower = searchTerm.toLowerCase().trim();
          filteredProducts = products.filter((product: Product) => {
            const nameMatch = product.name
              .toLowerCase()
              .includes(searchTermLower);
            const descriptionMatch = product.description
              ? product.description.toLowerCase().includes(searchTermLower)
              : false;
            return nameMatch || descriptionMatch;
          });
        }

        if (selectedBrand) {
          filteredProducts = filteredProducts.filter(
            (product: Product) => product.brand === selectedBrand
          );
        }

        setFilteredProducts(filteredProducts);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedBrand, searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set("brand", selectedBrand);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedBrand, pathname, router]);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const resetFilters = () => {
    setSelectedBrand(null);
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <div className="mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded w-full max-w-md"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {isLoading ? (
              <div>Loading products...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div>Our Products</div>
            ) : (
              <div>No products found</div>
            )}
          </h2>
          {error && <p className="text-gray-600 mb-6">{error}</p>}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <div className="w-full md:w-96">
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <h2 className="text-sm font-medium text-gray-500 mr-2">
            Filter by brand:
          </h2>
          <button
            onClick={() => setSelectedBrand(null)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              !selectedBrand
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Brands
          </button>
          {brands && brands.length > 0 ? (
            brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.name)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedBrand === brand.name
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {brand.name}
              </button>
            ))
          ) : (
            <div className="text-gray-500">Loading brands...</div>
          )}
        </div>

        {/* Active filters */}
        {(selectedBrand || searchTerm) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {selectedBrand && (
              <span className="inline-flex items-center bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800">
                Brand: {selectedBrand}
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: Product, index: number) => (
            <ProductCard
              key={`${product.id}-${index}`}
              id={product.id}
              name={product.name}
              description={product.description}
              images={product.images}
              quantity={product.quantity}
              slug={product.slug}
              price={product.price}
              brandName={product.brand}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
