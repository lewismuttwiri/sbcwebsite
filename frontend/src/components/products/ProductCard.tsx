"use client";

import { useState, useEffect, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiShoppingCart } from "react-icons/ci";
import { useCart } from "@/hooks/useCart";
import toast from "react-hot-toast";
import { ProductImage } from "@/utils/productUtils";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  images: ProductImage[];
  quantity?: string;
  slug: string;
  price: number;
  brandName: string;
  hidePriceAndCart?: boolean;
  className?: string;
}

export default function ProductCard({
  id,
  name,
  description,
  images = [],
  quantity,
  slug,
  price = 0, // Default to 0 if not provided
  brandName,
  className = "", // Default to empty string
  hidePriceAndCart = false,
}: ProductCardProps): JSX.Element {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isInCart, incrementQuantity, totalItems } = useCart();
  let intervalId: NodeJS.Timeout;

  // Auto-slide images when hovered (only if more than one image)
  useEffect(() => {
    if (isHovered && images && images.length > 1) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 800);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHovered, images]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart(id)) {
      incrementQuantity(id);
      toast.success(`${name} quantity incremented!`);
      console.log(totalItems);
      return;
    }

    try {
      addToCart(
        {
          id,
          name,
          price,
          image: images[0]?.src || "",
          slug,
          brandName,
        },
        1 // Default quantity
      );

      toast.success(`${name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <Link
      href={`/products/${slug}`}
      className={`block group h-full ${className}`}
      passHref
    >
      <div className="h-full">
        <div
          className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Quantity Badge */}
          <div className="absolute top-3 left-3 text-gray text-xs font-bold px-2 py-1 rounded-full z-10">
            {quantity ? `X${quantity}` : ""}
          </div>

          {/* Cart Icon - Only show if hidePriceAndCart is false */}
          {!hidePriceAndCart && (
            <button
              className={`absolute cursor-pointer top-3 right-3 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors ${
                isInCart(id)
                  ? "color-green-600 hover:color-green-700"
                  : "color-blue-600 hover:color-blue-700"
              }`}
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <CiShoppingCart className="w-5 h-5" />
            </button>
          )}

          {/* Image Container */}
          <div className="relative pt-[100%] overflow-hidden">
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    // crossOrigin="anonymous"
                    src={image.src}
                    alt={image.alt || name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}

            {/* Navigation Arrows */}
            {images && images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60 transition-all z-10"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60 transition-all z-10"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-4"
                        : "bg-white bg-opacity-50"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{name}</h3>
            {brandName && (
              <p className="text-sm text-gray-500 mb-2">{brandName}</p>
            )}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
              {description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              {!hidePriceAndCart ? (
                <>
                  <span className="text-lg font-bold text-gray-900">
                    {price
                      ? `KSh ${price.toLocaleString()}`
                      : "Contact for price"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {quantity ? `${quantity} per pack` : ""}
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500 w-full text-right">
                  {quantity ? `${quantity} per pack` : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// export default ProductCard;
