"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Button from "@/components/Button";
import SustainabilityCard from "@/components/SustainabilityCard";
import NewsCard from "@/components/NewsCard";
import HeroSection from "@/components/HeroSection";
import ImageSlider from "@/components/ImageSlider";
import ProductCard from "@/components/products/ProductCard";
import { sustainabilityItems } from "@/utils/sustainabilityData";
import { featuredBrands } from "@/data/featuredBrands";
import { getFeaturedProducts } from "@/utils/productUtils";
import { getAllNews } from "@/utils/news";
import SlidingBrands from "@/components/SlidingBrands";
import FAQAccordion from "@/components/FAQAccordion";
import WhatsAppModal from "@/components/WhatsAppModal";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundForward } from "react-icons/io";

const factoryImages = [
  "/images/factory/factory-1.jpeg",
  "/images/factory/factory-2.jpeg",
  "/images/factory/factory-3.jpeg",
  "/images/factory/factory-4.jpeg",
];

export default function Home() {
  // State management
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Refs for auto-scroll functionality
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleBrandClick = (brandId: string) => {
    router.push(`/brands#${brandId}`);
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);

        // Load products and news in parallel
        const [products, news] = await Promise.all([
          getFeaturedProducts(35).catch((error) => {
            console.error("Error loading products:", error);
            return [];
          }),
          getAllNews()
            .then((data) => {
              const sortedNews = [...data].sort(
                (a, b) => Number(b.id) - Number(a.id)
              );
              setNewsArticles(sortedNews);

              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
            }),
        ]);

        setFilteredProducts(products);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Auto-scroll functionality - optimized to prevent shaking
  useEffect(() => {
    if (
      !scrollContainerRef.current ||
      filteredProducts.length === 0 ||
      isLoading
    ) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    let animationId: number;
    let lastTime = 0;
    let scrollPosition = 0;
    const scrollSpeed = 0.6;
    let isScrolling = true;

    // Force hardware acceleration and optimize for smooth scrolling
    scrollContainer.style.transform = "translateZ(0)";
    scrollContainer.style.willChange = "scroll-position";
    scrollContainer.style.backfaceVisibility = "hidden";
    scrollContainer.style.perspective = "1000px";

    const animate = (currentTime: number) => {
      if (!isScrolling) return;

      if (currentTime - lastTime > 16) {
        // ~60fps
        if (!isPaused && scrollContainer) {
          const maxScroll =
            scrollContainer.scrollWidth - scrollContainer.clientWidth;

          // Use smooth scrolling with requestAnimationFrame
          scrollPosition = (scrollPosition + scrollSpeed) % (maxScroll * 2);

          // Reset position for infinite loop
          if (scrollPosition >= maxScroll) {
            scrollPosition = 0;
            scrollContainer.scrollLeft = 0;
          } else {
            scrollContainer.scrollTo({
              left: scrollPosition,
              behavior: "auto",
            });
          }
        }
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(animate);
    };

    // Start with a small delay to ensure everything is ready
    const startTimer = setTimeout(() => {
      // console.log("Starting optimized auto-scroll animation");
      // Initialize scroll position
      scrollContainer.scrollLeft = 0;
      scrollPosition = 0;
      isScrolling = true;
      animationId = requestAnimationFrame(animate);
    }, 300);

    // Cleanup function
    return () => {
      isScrolling = false;
      clearTimeout(startTimer);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      // Reset styles on cleanup
      if (scrollContainer) {
        scrollContainer.style.transform = "";
        scrollContainer.style.willChange = "";
        scrollContainer.style.backfaceVisibility = "";
        scrollContainer.style.perspective = "";
      }
    };
  }, [filteredProducts, isPaused, isLoading]);

  // Render loading skeleton
  const renderProductSkeleton = () => (
    <div className="flex space-x-8 pb-6">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-72 h-96 bg-gray-100 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );

  // Render product cards with optimized performance
  const renderProductCards = () => {
    if (filteredProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">
            No products available at the moment.
          </p>
        </div>
      );
    }

    // Double the products array for seamless infinite scrolling
    const extendedProducts = [...filteredProducts, ...filteredProducts];

    return (
      <div className="flex">
        {extendedProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex-shrink-0 w-56 sm:w-64 md:w-72 px-2 sm:px-3 md:px-4"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/20 transition-colors duration-300" />

              <ProductCard
                id={product.id}
                name={product.name}
                images={product.images}
                slug={product.slug}
                brandName={product.brandName}
                price={product.price}
                hidePriceAndCart={true}
                className="flex-1"
              />

              {/* Optimized hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render progress indicator
  const renderProgressIndicator = () => (
    <div className="flex justify-center mt-6">
      <div className="flex space-x-2">
        {filteredProducts
          .slice(0, Math.min(5, filteredProducts.length))
          .map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  index ===
                  Math.floor((Date.now() / 3000) % filteredProducts.length)
                    ? "#0E0E96"
                    : "#D1D5DB",
              }}
            />
          ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* Brands Section */}
      <section className="py-20 bg-[#0E0E96]">
        <Container className="px-4">
          <div className="text-center mb-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Brands</h2>
            <p className="max-w-3xl mx-auto text-white">
              Explore our wide range of refreshing beverage brands that cater to
              every taste and occasion.
            </p>
          </div>
          <div className="flex justify-between gap-8 md:gap-12 lg:gap-16 mb-12 flex-wrap">
            {[
              { src: "/images/logo/pepsi_logo.png", alt: "Pepsi" },
              { src: "/images/logo/mir.png", alt: "Mirinda" },
              { src: "/images/logo/mtn.png", alt: "Mountain+Dew" },
              { src: "/images/logo/7up.png", alt: "7up" },
              { src: "/images/logo/sting-logo.png", alt: "sting" },
              { src: "/images/logo/aquafina-logo.jpg", alt: "Aquafina" },
              { src: "/images/logo/evervess-logo.png", alt: "Evervess" },
            ].map((brand, index) => (
              <motion.div
                key={index}
                className="h-16 flex items-center justify-between"
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
                onClick={() => handleBrandClick(brand.alt)}
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
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l" />
            <SlidingBrands brands={featuredBrands} />
          </div>
          <div className="text-center mt-12">
            <Link href="/brands">
              <Button variant="secondary" className="text-gray-900 bg-white">
                View All Brands
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white overflow-hidden">
        <Container className="px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Products
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Discover our portfolio of refreshing beverages that have been
              quenching Kenya's thirst for generations.
            </p>
          </div>

          {isLoading ? (
            renderProductSkeleton()
          ) : (
            <div className="relative">
              {/* Gradient overlays - Reduced width on all screens */}
              <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 lg:w-16 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 lg:w-16 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />

              {/* Pause/Play button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-300 hover:shadow-xl group"
                aria-label={isPaused ? "Resume scrolling" : "Pause scrolling"}
              >
                {isPaused ? (
                  <svg
                    className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                )}
              </button>

              <div className="relative w-full overflow-hidden">
                <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-hidden py-6 md:py-8 scrollbar-hide"
                  style={{ scrollBehavior: "auto" }}
                >
                  <div
                    ref={scrollContentRef}
                    className="flex space-x-4 md:space-x-6 lg:space-x-8"
                  >
                    {renderProductCards()}
                  </div>
                </div>
              </div>

              {filteredProducts.length > 0 && renderProgressIndicator()}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button
                variant="primary"
                className="relative overflow-hidden group  duration-200"
              >
                <span className="relative z-10">View All Products</span>
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* About Us Section */}
      <section className="py-10 bg-[#ededed]">
        <Container className="px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center pb-10">
            About Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Producing Refreshments <br />
                <span className="text-blue-600">With Excellence</span>
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Seven Up Bottling Company (SBC) Kenya is a leading beverage
                company committed to delivering refreshing experiences to our
                consumers through state-of-the-art production facilities.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                As the official bottler of PepsiCo beverages in Kenya, we
                maintain the highest standards of quality and innovation,
                ensuring every bottle meets international standards.
              </p>
              <Button
                onClick={() => (window.location.href = "/about")}
                className="inline-flex items-center"
              >
                Discover Our Story
                <IoIosArrowRoundForward size={24} className="ml-2" />
              </Button>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <ImageSlider images={factoryImages} interval={4000} />
            </div>
          </div>
        </Container>
      </section>

      {/* Distributor Application Section */}
      <section className="py-20  bg-white">
        <Container className="px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-900">
            Partner with Us
          </h2>
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
            <div className="w-full lg:w-1/2 h-96 lg:h-auto overflow-hidden flex justify-center">
              <Image
                src="/images/distributor/products.png"
                alt="Become a stockist"
                width={400}
                height={400}
                className="object-contain"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Become a Stockist
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Join our network of trusted stockists and bring our refreshing
                beverages to customers across Kenya. Partner with SBC Kenya to
                grow your business with a portfolio of leading beverage brands.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  {
                    title: "Wide Product Range",
                    description:
                      "Access to a diverse portfolio of leading beverage brands",
                    icon: "📦",
                  },
                  {
                    title: "Business Support",
                    description: "Comprehensive training and marketing support",
                    icon: "💼",
                  },
                  {
                    title: "Growth Opportunities",
                    description: "Exclusive territories",
                    icon: "📈",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    {/* <div className="text-2xl mt-1">{item.icon}</div> */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/partner/stockist" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto px-8 py-3 text-lg font-medium"
                  >
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gray-200">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest happenings at SBC Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsArticles.slice(0, 3).map((article) => (
              <NewsCard
                key={article.id}
                image={article.image}
                alt={article.title}
                date={article.date}
                category={article.category}
                title={article.title}
                description={article.description}
                link={`/news/${article.id}`}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button href="/news">View All News</Button>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-white bg-[#0E0E96]">
        <Container className="px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the SBC Kenya Family
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Whether you're looking for career opportunities or want to become
              a distribution partner, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/contact"
                variant="secondary"
                className="hover:border-1 hover:rounded-3xl bg-white text-black hover:border-gray-500 hover:transition-all hover:duration-300 hover:ease-in-out"
              >
                Contact Us
              </Button>

              <Button
                href="/careers/jobs"
                variant="secondary"
                className="border-1 rounded-3xl bg- text-white border-gray-600 hover:border-gray-500 hover:transition-all hover:duration-300 hover:ease-in-out"
              >
                View Career Opportunities
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <Container className="px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about becoming a stockist,
              retailer, or partner with PEPSI.
            </p>
          </div>
          <FAQAccordion />
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Didn't find what you're looking for?
            </p>

            <div className="flex flex-col sm:flex-row space-x-4 md:space-y-0 space-y-4 justify-center items-center ">
              <Link href="/contact">
                <Button variant="primary">Contact Us</Button>
              </Link>
              <button
                onClick={() => {
                  setIsWhatsAppModalOpen(true);
                }}
                className="border border-gray-600 rounded-3xl bg-white text-black hover:transition-all hover:duration-300 hover:ease-in-out py-3 px-5 cursor-pointer"
              >
                Enquire on WhatsApp
              </button>
            </div>
          </div>
        </Container>
      </section>

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />
    </main>
  );
}
