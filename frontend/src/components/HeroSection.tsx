"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState, useEffect } from "react";

const heroSectionImages = [
  {
    srcLarge: "/images/hero-section/pepsi-home.jpg",
    srcMobile: "/images/hero-section/pepsi-home-mobile.jpeg",
    name: "thirsty for more",
  },
];

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();

      // Trigger visibility after component mounts
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timer);
      };
    }
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="flex items-center justify-center w-full h-full relative">
        {heroSectionImages.map((image, index) => (
          <div
            key={index}
            className={clsx(
              "relative w-full h-[80vh] sm:h-[90vh] md:h-[75vh] lg:h-[80vh] max-w-10xl rounded-2xl overflow-hidden cursor-pointer shadow-2xl",
              "transition-all duration-1000 ease-out transform",
              imageLoaded
                ? isVisible
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-110"
                : "opacity-0 scale-105"
            )}
            style={{
              transform: isVisible ? "scale(1)" : "scale(1.05)",
              opacity: isVisible ? 1 : 0,
              transition: "opacity 1s ease-out, transform 5s ease-out",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={isMobile ? image.srcMobile : image.srcLarge}
                alt={image.name}
                fill
                sizes={isMobile ? "100vw" : "100vw"}
                className={clsx(
                  "object-cover w-full h-full transition-transform duration-10000 ease-out",
                  isVisible && imageLoaded ? "scale-100" : "scale-110"
                )}
                style={{
                  transform:
                    isVisible && imageLoaded ? "scale(1)" : "scale(1.1)",
                  transition: "transform 8s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onLoad={handleImageLoad}
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
