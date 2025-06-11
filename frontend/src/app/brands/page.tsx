"use client";

import { featuredBrands } from "@/data/featuredBrands";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/Button";
import { FiArrowRight } from "react-icons/fi";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function BrandsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate through images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle hash navigation on page load and hash change
  useEffect(() => {
    const scrollToSection = () => {
      let hash = window.location.hash;
      if (hash) {
        // Special case for Mountain+Dew
        if (hash.toLowerCase() === "#mountain+dew") {
          const element = document.getElementById("Mountain+Dew");
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            return;
          }
        }

        // Clean the hash to handle special characters and numbers at the start
        const cleanHash = hash.replace(/[^a-zA-Z0-9-_:.]/g, "");
        // If hash starts with a number, add a prefix
        const selector = /^\d/.test(cleanHash)
          ? `#brand-${cleanHash}`
          : `#${cleanHash}`;

        try {
          const element = document.querySelector(selector);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            // If element not found, retry after a longer delay (page might still be loading)
            setTimeout(() => {
              const retryElement = document.querySelector(selector);
              if (retryElement) {
                retryElement.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 500);
          }
        } catch (error) {
          console.error("Error scrolling to section:", error);
        }
      }
    };

    // Multiple attempts to scroll, as the page might still be loading
    const timeouts = [100, 300, 500, 1000];

    timeouts.forEach((delay) => {
      setTimeout(scrollToSection, delay);
    });

    // Listen for hash changes
    window.addEventListener("hashchange", scrollToSection);

    return () => {
      window.removeEventListener("hashchange", scrollToSection);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Our Brands
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover our premium selection of trusted brands
          </p>
        </motion.div>
        <div className="flex justify-between gap-8 md:gap-12 lg:gap-16 mb-12 flex-wrap">
          {[
            { src: "/images/logo/7up.png", alt: "7Up Logo" },
            { src: "/images/logo/mir.png", alt: "Mirinda Logo" },
            { src: "/images/logo/mtn.png", alt: "Mountain Dew Logo" },
            { src: "/images/logo/pepsi_logo.png", alt: "Pepsi Logo" },
            { src: "/images/logo/aquafina-logo.jpg", alt: "Aquafina Logo" },
            { src: "/images/logo/evervess-logo.png", alt: "Evervess Logo" },
            { src: "/images/logo/sting-logo.png", alt: "Sting Logo" },
          ].map((brand, index) => (
            <motion.div
              key={index}
              className="h-16 w-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 0.8,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                },
              }}
              whileHover={{
                scale: 1.1,
                opacity: 1,
                transition: { duration: 0.2 },
              }}
              viewport={{ once: true }}
            >
              <Image
                src={brand.src}
                alt={brand.alt}
                width={80}
                height={64}
                className="h-full w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-24"
        >
          {featuredBrands.map((brand, index) => (
            <motion.section
              key={brand.id}
              id={/^\d/.test(brand.id) ? `brand-${brand.id}` : brand.id}
              className="scroll-mt-32 py-8"
              variants={item}
            >
              <div
                className={`w-full ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } flex flex-col items-center justify-between gap-12`}
              >
                <motion.div
                  className="w-full lg:w-1/3 relative rounded-2xl shadow-2xl bg-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: "easeOut" },
                  }}
                  viewport={{ once: true, margin: "-100px 0px" }}
                >
                  <div
                    className="w-full h-80 relative flex items-center justify-center rounded-2xl shadow-2xl"
                    style={{
                      background: brand.color
                        ? `linear-gradient(135deg, ${brand.color?.from}, ${
                            brand.color?.to || brand.color?.from
                          })`
                        : "white",
                    }}
                  >
                    {Array.isArray(brand.image) ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {brand.image.map((img, idx) => (
                          <motion.div
                            key={idx}
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity:
                                idx === currentImageIndex % brand.image.length
                                  ? 1
                                  : 0,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <Image
                              src={img}
                              alt={`${brand.name} ${idx + 1}`}
                              width={280}
                              height={280}
                              className="object-contain max-h-full max-w-full p-4"
                              priority={index < 2}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          width={280}
                          height={280}
                          className="object-contain max-h-full max-w-full p-4"
                          priority={index < 2}
                        />
                      </div>
                    )}
                  </div>

                  {/* <div className=" inset-0 bg-gradient-to-t to-transparent flex items-end p-6">
                    <h2
                      className="text-3xl font-bold"
                      style={{ color: brand.color?.text || "#000000" }}
                    >
                      {brand.name}
                    </h2>
                  </div> */}
                </motion.div>

                <motion.div
                  className={`w-full lg:w-2/3 space-y-6 px-4 sm:px-6 ${
                    index % 2 === 0 ? "lg:pl-12" : "lg:pr-12"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: "easeOut", delay: 0.1 },
                  }}
                  viewport={{ once: true, margin: "-100px 0px" }}
                >
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    {brand.name}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {brand.description}
                  </p>
                  <div className="mt-4">
                    <Button
                      href={`/products?brand=${brand.id}`}
                      variant="primary"
                      className="group inline-flex items-center gap-2 px-6 py-3 text-lg"
                    >
                      <span>Shop Now</span>
                      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
