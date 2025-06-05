"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";

type Brand = {
  id: string;
  name: string;
  image: string | string[];
  description: string;
  link?: string;
};

interface SlidingBrandsProps {
  brands: Brand[];
}

export default function SlidingBrands({ brands }: SlidingBrandsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleBrandClick = (brandId: string) => {
    router.push(`/brands#${brandId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {brands.map((brand) => {
        return (
          <div
            key={brand.id}
            onClick={() => handleBrandClick(brand.id)}
            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
          >
            <div className="relative w-full aspect-square overflow-hidden">
              {Array.isArray(brand.image) ? (
                <div className="relative w-full h-full">
                  {brand.image.map((img, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        idx === currentImageIndex % brand.image.length
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${brand.name} ${idx + 1}`}
                        fill
                        className="object-contain p-4 sm:p-6"
                        sizes="(max-width: 300px) 100vw, 300px"
                        priority={idx === 0}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-contain p-4 sm:p-6 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 300px) 100vw, 300px"
                  priority
                />
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {brand.name}
              </h3>
              <p className="text-gray-600 mb-2 flex-1">
                {brand.description.slice(0, 80) + "..."}
              </p>
              <span className="inline-flex items-center text-blue-600 font-medium group-hover:underline">
                Explore {brand.name}
                <IoIosArrowForward size={20} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
