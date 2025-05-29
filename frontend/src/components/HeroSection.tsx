"use client";

import Container from "./layout/Container";
import { useState, useEffect } from "react";
import clsx from "clsx";

export default function HeroSection() {
  const desktopVideos = [
    {
      src: "/videos/hero_section/pepsi.mp4",
      name: "Pepsi",
      mobileSrc: "/videos/hero_section/mobile/pepsi.mp4",
    },
    {
      src: "/videos/hero_section/mountain_dew.mp4",
      name: "Mountain Dew",
      mobileSrc: "/videos/hero_section/mobile/mountaindew.mp4",
    },
    {
      src: "/videos/hero_section/7up.mp4",
      name: "7UP",
      mobileSrc: "/videos/hero_section/mobile/sevenup.mp4",
    },
    {
      src: "/videos/hero_section/mirinda_orange.mp4",
      name: "Mirinda Orange",
      mobileSrc: "/videos/hero_section/mobile/mirinda.mp4",
    },
    {
      src: "/videos/hero_section/sting.mp4",
      name: "Sting",
      mobileSrc: "/videos/hero_section/mobile/sting.mp4",
    },
    {
      src: "/videos/hero_section/aquafina.mp4",
      name: "Aquafina",
      mobileSrc: "/videos/hero_section/mobile/aquafina.mp4",
    },
    {
      src: "/videos/hero_section/evervess.mp4",
      name: "Evervess",
      mobileSrc: "/videos/hero_section/mobile/evervess.mp4",
    }, // Fallback to desktop version if mobile not available
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [videos, setVideos] = useState(desktopVideos);

  useEffect(() => {
    // Check if mobile device on component mount and window resize
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768; // Tailwind's md breakpoint
      setIsMobile(mobile);
      setVideos(
        desktopVideos.map((video) => ({
          ...video,
          src: mobile && video.mobileSrc ? video.mobileSrc : video.src,
        }))
      );
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [videos.length]);

  return (
    <section
      aria-label="Featured Beverages"
      className="relative min-h-[90vh] flex items-center overflow-hidden transition-colors duration-500 py-8 md:py-4"
    >
      {/* Gradient overlay for better text visibility */}
      <div className="absolute inset-0">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 mix-blend-multiply" />
        {/* Gradient overlay - darker at the top, lighter at the bottom */}
        {/* bg-gradient-to-b from-black/40 via-black/40 to-black/10 */}
        <div className="absolute inset-0" />
      </div>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {videos.map((video, index) => (
          <video
            key={`${video.src}-${isMobile ? "mobile" : "desktop"}`}
            autoPlay
            loop
            muted
            playsInline
            className={clsx(
              "absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out hero-video",
              isTransitioning && index === currentIndex
                ? "translate-x-0 opacity-100"
                : index === currentIndex
                ? "translate-x-0 opacity-100"
                : index === (currentIndex - 1 + videos.length) % videos.length
                ? "translate-x-[-100%] opacity-100"
                : "translate-x-full opacity-0"
            )}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: -1,
              pointerEvents: "none",
            }}
          >
            <source src={video.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>

      {/* Semi-transparent overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content container */}
      <Container className="relative z-20 px-4">
        <div className="flex flex-col justify-center h-full">
          <div className="text-left">
            <h1 className="font-poetsen text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-6 leading-tight text-white tracking-tight">
              Refreshing Kenya
              <span className="text-opacity-80 text-white block mt-1 font-light">
                One Sip at a Time
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-lg mb-4 opacity-80 md:mb-4 text-white text-opacity-90 max-w-md md:mx-0 leading-relaxed">
              Experience the vibrant, refreshing taste of our world-class
              beverages.
            </p>
            <p className="text-sm sm:text-base md:text-lg opacity-80 mb-6 md:mb-8 text-white text-opacity-80 max-w-md md:mx-0 leading-relaxed">
              SBC Kenya is the official bottler of PepsiCo beverages in Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start max-w-xs md:max-w-none md:mx-0">
              <button
                className="bg-white text-black px-3 md:px-6 py-3 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-opacity-90 transition-all tracking-wide"
                onClick={() => (window.location.href = "/products")}
              >
                Explore Our brands
              </button>
              <button
                className="border-2 border-white text-white hover:border-white hover:text-black px-3 md:px-6 py-3 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-white hover:bg-opacity-10 transition-all tracking-wide"
                onClick={() => (window.location.href = "/about")}
              >
                About Us
              </button>
            </div>
          </div>

          <div className="relative hidden md:block"></div>
        </div>
      </Container>

      {/* Navigation dots */}
      <div className="hero-dots">
        {videos.map((_, index) => (
          <div
            key={index}
            className={clsx("hero-dot", index === currentIndex && "active")}
            onClick={() => {
              setCurrentIndex(index);
              setIsTransitioning(false);
            }}
          />
        ))}
      </div>
    </section>
  );
}
