"use client";

import Image from "next/image";

const Brands = ({ featuredBrands }: { featuredBrands: any[] }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Iconic Brands</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover our portfolio of refreshing beverages that have been
            quenching Kenya's thirst for generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredBrands.map((brand) => (
            <div
              key={brand.name}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-center mb-6 h-40 relative">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={120}
                    height={160}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{brand.name}</h3>
                <p className="text-gray-600 mb-4 text-center flex-grow">
                  {brand.description}
                </p>
                <a
                  href={brand.link}
                  className="mt-auto text-blue-600 hover:text-blue-800 font-medium text-center block"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/brands"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            View All Brands
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Brands;
