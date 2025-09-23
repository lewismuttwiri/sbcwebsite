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
            className="group relative bg-[#0d0d7a] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
          >
            <div className="relative w-full aspect-square overflow-hidden ">
              {Array.isArray(brand.image) ? (
                <div className="relative w-full h-full ">
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
              <div className="flex-1">
                <div className="md:transform md:group-hover:-translate-y-12 transition-transform duration-500 ease-out">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {brand.name}
                  </h3>
                  <p className="text-white mb-4">
                    {brand.description.slice(0, 80) + "..."}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:absolute md:bottom-6 md:left-4 md:right-0 md:mt-0">
                <div
                  className="w-fit flex items-center justify-start py-3 px-6 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20
    md:transform md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 
    transition-all duration-500 ease-out hover:shadow-xl hover:bg-white hover:scale-105"
                >
                  <span className="relative inline-flex items-center text-[#0d0d7a] font-semibold group-hover:text-[#0a0a65] transition-all duration-300 ease-out cursor-pointer text-xs">
                    <span className="relative">
                      Explore {brand.name}
                      <span
                        className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-[#0d0d7a] to-[#0a0a65] 
                       transform translate-y-1.5 group-hover:w-full transition-all duration-300 ease-out"
                      ></span>
                    </span>
                    <IoIosArrowForward
                      size={18}
                      className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300 ease-out"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
