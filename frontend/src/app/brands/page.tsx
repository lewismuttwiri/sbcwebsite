"use client";

import { featuredBrands } from "@/data/featuredBrands";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/Button";
import { FiArrowRight, FiLayers, FiInfo } from "react-icons/fi";
import { useRouter } from "next/navigation";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const brandLogos = [
  { src: "/images/logo/pepsi_logo.png", alt: "Pepsi" },
  { src: "/images/logo/mir.png", alt: "Mirinda" },
  { src: "/images/logo/mtn.png", alt: "Mountain+Dew" },
  { src: "/images/logo/7up.png", alt: "7up" },
  { src: "/images/logo/sting-logo.png", alt: "Sting" },
  { src: "/images/logo/aquafina-logo.jpg", alt: "Aquafina" },
  { src: "/images/logo/evervess-logo.png", alt: "Evervess" },
];

export default function BrandsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Rotate through images every 4 seconds for smoother experience
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 4000);

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative text-center pt-20 pb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text mb-6 tracking-tight">
              Our Brands
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Discover our curated collection of world-class beverage brands
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Brand Logos Section */}
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mb-24"
        >
          <div className="">
            <div className="flex flex-wrap justify-between items-center gap-8 md:gap-12 lg:gap-16">
              {brandLogos.map((brand, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  }}
                  whileHover={{
                    scale: 1.15,
                    transition: { duration: 0.3 },
                  }}
                  viewport={{ once: true }}
                  onClick={() => router.push(`/products?brand=${brand.alt}`)}
                >
                  <div className="relative p-4 rounded-2xl   border transition-all duration-300">
                    <Image
                      src={brand.src}
                      alt={brand.alt}
                      width={80}
                      height={64}
                      className="h-16 w-auto object-contain transition-all duration-300"
                    />
                    {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Brands */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-32"
        >
          {featuredBrands.map((brand, index) => (
            <motion.section
              key={brand.id}
              id={/^\d/.test(brand.id) ? `brand-${brand.id}` : brand.id}
              className="scroll-mt-32 relative"
              variants={item}
            >
              {/* Subtle horizontal line separator */}
              {index > 0 && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              )}

              <div
                className={`flex flex-col lg:flex-row items-center gap-16 ${
                  index % 2 === 0 ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Brand Image */}
                <motion.div
                  className="w-full lg:w-2/5 relative"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  }}
                  viewport={{ once: true, margin: "-100px 0px" }}
                >
                  <div className="relative group">
                    {/* Floating background elements */}
                    {/* <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" /> */}
                    {/* <div className="absolute -inset-2 bg-gradient-to-r from-white/40 to-white/20 rounded-2xl" /> */}

                    <div
                      className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500"
                      style={{
                        background: brand.color
                          ? `linear-gradient(135deg, ${brand.color?.from}, ${
                              brand.color?.to || brand.color?.from
                            })`
                          : "white",
                      }}
                    >
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/20" />
                        <div
                          className="absolute top-0 left-0 w-full h-full animate-pulse"
                          // style={{
                          //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          // }}
                        />
                      </div>

                      {Array.isArray(brand.image) ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {brand.image.map((img, idx) => (
                            <motion.div
                              key={idx}
                              className="absolute inset-0 flex items-center justify-center"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{
                                opacity:
                                  idx === currentImageIndex % brand.image.length
                                    ? 1
                                    : 0,
                                scale:
                                  idx === currentImageIndex % brand.image.length
                                    ? 1
                                    : 0.9,
                              }}
                              transition={{
                                duration: 0.8,
                                ease: [0.25, 0.46, 0.45, 0.94],
                              }}
                            >
                              <Image
                                src={img}
                                alt={`${brand.name} ${idx + 1}`}
                                width={320}
                                height={320}
                                className="object-contain max-h-[90%] max-w-[90%] drop-shadow-2xl"
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
                            width={320}
                            height={320}
                            className="object-contain max-h-[90%] max-w-[90%] drop-shadow-2xl"
                            priority={index < 2}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Brand Content */}
                <motion.div
                  className={`w-full lg:w-3/5 space-y-8 ${
                    index % 2 === 0 ? "lg:pl-8" : "lg:pr-8"
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.2,
                    },
                  }}
                  viewport={{ once: true, margin: "-100px 0px" }}
                >
                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                      {brand.name}
                    </h2>

                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed ">
                      {brand.description}
                    </p>

                    {/* Subtle divider */}
                    <div className="w-60 h-px bg-gradient-to-r from-gray-300 to-transparent mx-auto lg:mx-0"></div>

                    {/* Clean Content Layout */}
                    <div className="space-y-8">
                      {/* Sizes Section */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-[#0E0E96]/10">
                            <FiLayers className="w-5 h-5 text-[#0E0E96]" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Available Sizes
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {brand.sizes.map((size: string, idx: number) => (
                            <motion.div
                              key={idx}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-blue-700 font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200"
                              whileHover={{ scale: 1.05 }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              {size}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* {brand.ingredients && (
                        <>
                          <div className="relative">
                            <div
                              className="absolute inset-0 flex items-center"
                              aria-hidden="true"
                            >
                              <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center lg:justify-start">
                              <span className="bg-white px-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-[#0E0E96] to-blue-400 rounded-full"></div>
                              </span>
                            </div>
                          </div>

                          <div className="space-y-6 pt-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="absolute inset-0 bg-[#0E0E96]/20 rounded-xl blur-sm"></div>
                                <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#0E0E96]/10 to-[#0E0E96]/5 border border-[#0E0E96]/20">
                                  <FiInfo className="w-6 h-6 text-[#0E0E96]" />
                                </div>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                  Ingredients
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  What makes this special
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {brand.ingredients.map(
                                (ingredient: string, idx: number) => (
                                  <motion.div
                                    key={idx}
                                    className="group relative overflow-hidden"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: idx * 0.08,
                                      duration: 0.4,
                                    }}
                                  >
                                    <motion.div
                                      className="relative px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                                      whileHover={{
                                        scale: 1.03,
                                        borderColor: "#0E0E96",
                                        boxShadow:
                                          "0 8px 25px -5px rgba(14, 14, 150, 0.1)",
                                      }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E96]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>

                                      <div className="relative flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#0E0E96]/60 rounded-full flex-shrink-0"></div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#0E0E96] transition-colors duration-200">
                                          {ingredient}
                                        </span>
                                      </div>
                                    </motion.div>
                                  </motion.div>
                                )
                              )}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    <span className="font-medium">
                                      Please note:
                                    </span>{" "}
                                    Ingredients may vary by region and
                                    production batch. Always check the product
                                    label for the most current and accurate
                                    ingredient information.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )} 
                       */}
                    </div>
                    <div className="w-60 h-px bg-gradient-to-r from-gray-300 to-transparent mx-auto lg:mx-0"></div>

                    {/* CTA Button */}
                    <motion.div
                      className="pt-6"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        href={`/products?brand=${brand.id}`}
                        variant="primary"
                        className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold  bg-[#0E0E96] hover:from-blue-700  text-white rounded-2xl shadow-lg  transition-all duration-300"
                      >
                        <span className="relative z-10">Shop Now</span>
                        <FiArrowRight className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          ))}
        </motion.div>
      </Container>

      {/* Bottom spacing */}
      <div className="h-24" />
    </div>
  );
}
