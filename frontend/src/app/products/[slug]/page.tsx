"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiChevronLeft } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

import type { Product } from "@/data/brands";
import Button from "@/components/Button";
import { CartItem, useCart } from "@/hooks/useCart";
import toast from "react-hot-toast";
import Container from "@/components/layout/Container";

// This is a client component that will be hydrated on the client
export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Initialize cart
  const { addToCart, isInCart, getItemQuantity, isInitialized } = useCart();

  // Update quantity if item is already in cart
  useEffect(() => {
    if (product && isInitialized) {
      const cartQuantity = getItemQuantity(product.slug);
      if (cartQuantity > 0) {
        setQuantity(cartQuantity);
      }
    }
  }, [product, isInitialized, getItemQuantity]);

  // Quantity handlers
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity(1);
      return;
    }
    const numValue = parseInt(value, 1000);
    // if (!isNaN(numValue) && numValue >= 1 && numValue <= 1000) {
    //   setQuantity(numValue);
    // }
  };

  const handleQuantityBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity(1);
      return;
    }
    const numValue = parseInt(value, 1000);
    if (isNaN(numValue) || numValue < 1 || numValue > 1000) {
      setQuantity(1);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev: number) => Math.min(prev + 1, 1000));
  };

  const decrementQuantity = () => {
    setQuantity((prev: number) => Math.max(prev - 1, 1));
  };

  // Update quantity if item is already in cart
  useEffect(() => {
    if (product && isInitialized) {
      const cartQuantity = getItemQuantity(product.slug);
      if (cartQuantity > 0) {
        setQuantity(cartQuantity);
      }
    }
  }, [product, isInitialized]);

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const params = await paramsPromise;
        setSlug(params.slug);

        const productsResponse = await fetch("/api/products");
        if (!productsResponse.ok) {
          toast.error("Failed to fetch products");
          return;
        }
        const data = await productsResponse.json();

        const foundProduct = data.find(
          (p: Product) => p.slug.toLowerCase() === params.slug.toLowerCase()
        );
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          console.error(`Product with slug ${params.slug} not found`);
          router.push("/products");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Error loading product details");
        router.push("/products");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [paramsPromise, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <Link href="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    console.log("Adding product to cart", product.id);
    if (!product) return;
    if (isInCart(product.id)) {
      console.log("Product already in cart", product.id);
      // toast.success(`${product.name} quantity incremented!`);
      router.push("/cart");
      return;
    }
    console.log("Product not in cart");
    setIsAddingToCart(true);

    try {
      const cartItem: Omit<CartItem, "quantity"> = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.src || "",
        slug: product.slug,
        brandName: product.brand,
      };

      addToCart(cartItem, quantity);
      setShowAddedToCart(true);

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setShowAddedToCart(false);
      }, 3000);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleImageNavigation = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0]?.src || "/images/og-image.jpg",
    "description": product.description || `Buy ${product.name} online from SBC Kenya`,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://sbc-kenya.com/products/${product.slug}`,
      "priceCurrency": "KES",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0], // 30 days from now
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link
              href="/products"
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <FiChevronLeft className="mr-1" /> Back to Products
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative w-3/4 mx-auto bg-gray-100 rounded-lg overflow-hidden">
                  {product.images && product.images.length > 0 && (
                    <div className="relative w-full h-96">
                      <Image
                        src={product.images[currentImageIndex]?.src || ""}
                        alt={
                          product.images[currentImageIndex]?.alt || product.name
                        }
                        fill
                        className="object-contain p-4"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageNavigation(index)}
                        className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                          currentImageIndex === index
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt || `${product.name} - ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Buy {product.name} Online - {product.brand}
                </h1>
                <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    Ksh.{(Number(product.price) || 0).toFixed(2)}
                  </h2>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    Description
                  </h3>
                  <p className="mt-2 text-gray-600">{product.description}</p>
                </div>

                <div className="mt-6">
                  <div className="mb-6">
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Quantity (1-1000):
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={decrementQuantity}
                        className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <span className="text-lg">−</span>
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        max="1000"
                        value={quantity}
                        onChange={handleQuantityChange}
                        onBlur={handleQuantityBlur}
                        className="w-16 px-2 py-2 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        aria-label="Quantity"
                      />
                      <button
                        type="button"
                        onClick={incrementQuantity}
                        className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        disabled={quantity >= 1000}
                        aria-label="Increase quantity"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => handleAddToCart()}
                    disabled={isAddingToCart}
                    className={`transition-all duration-300 cursor-pointer ${
                      isInCart(product.slug)
                        ? "bg-green-500 hover:bg-green-600"
                        : "hover:border-2 hover:border-gray-400 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <>
                        <FiShoppingCart />
                        <span>
                          {isInCart(product.id) ? "View Cart" : "Add to Cart"}
                        </span>
                      </>
                    </div>
                  </Button>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900">Details</h3>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Brand:</span>{" "}
                      {product.brand}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Availability:</span> In
                      Stock
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
