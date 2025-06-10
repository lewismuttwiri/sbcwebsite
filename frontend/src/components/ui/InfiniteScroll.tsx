"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface InfiniteScrollProps {
  images: { image: string }[];
  speed?: "slow" | "normal" | "fast";
  scrollDirection?: "up" | "down";
  columns?: number;
}

export default function InfiniteScroll({
  images,
  speed = "normal",
  scrollDirection = "down",
  columns = 3,
}: InfiniteScrollProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setIsReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  if (isReducedMotion) {
    return (
      <div className="flex gap-8 p-8">
        {images.map((image, index) => (
          <div key={index} className="relative w-64 h-96 flex-shrink-0">
            <Image
              src={image.image}
              alt={`Event ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    );
  }

  // Duration based on speed - higher is slower
  const getDuration = () => {
    switch (speed) {
      case "slow":
        return 70;
      case "fast":
        return 25;
      case "normal":
      default:
        return 30;
    }
  };

  const animationDuration = `${getDuration()}s`;

  // Responsive columns
  const getColumnCount = () => {
    if (typeof window === "undefined") return columns;
    const width = window.innerWidth;
    if (width < 640) return 1; // sm
    if (width < 1024) return 2; // md
    return Math.min(columns, 4); // lg and up, max 4 columns
  };

  // Animation keyframes for vertical scroll
  const scrollAnimation = `
    @keyframes scroll-up {
      0% { transform: translateY(0); }
      100% { transform: translateY(-50%); }
    }
    @keyframes scroll-down {
      0% { transform: translateY(-50%); }
      100% { transform: translateY(0); }
    }
    
    .scroll-container {
      height: 600px;
      overflow: hidden;
      position: relative;
    }
    
    .scroll-content {
      position: absolute;
      width: 100%;
      height: 200%;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      will-change: transform;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      padding: 1.5rem;
    }
    
    .scroll-item {
      width: 100%;
      min-height: 250px;
      height: 100%;
      aspect-ratio: 3/4;
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease-out;
    }
    
    .scroll-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    @media (max-width: 1024px) {
      .scroll-content {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
      .scroll-item {
        min-height: 180px;
      }
    }
    
    @media (max-width: 640px) {
      .scroll-content {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
      }
      .scroll-item {
        min-height: 250px;
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      .scroll-content {
        animation: none !important;
        height: auto;
      }
    }
  `;

  // Add the animation styles to the document
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = scrollAnimation;
    document.head.appendChild(style);
    return () => {
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [scrollAnimation]);

  if (!isMounted) {
    return null;
  }

  // Duplicate items for seamless loop
  const getItems = () => [...images, ...images, ...images];

  return (
    <div className="scroll-container">
      <div
        ref={containerRef}
        className="scroll-content"
        style={{
          animation: `scroll-${scrollDirection} ${animationDuration} linear infinite`,
        }}
      >
        {getItems().map((image, index) => (
          <div key={`img-${index}`} className="scroll-item">
            <Image
              src={image.image}
              alt={`Event ${index + 1}`}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 150px, 200px"
              quality={80}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
