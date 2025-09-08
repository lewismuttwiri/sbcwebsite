"use client";

import Container from "@/components/layout/Container";
import Link from "next/link";

export default function PartnerPage() {
  return (
    <main className="min-h-screen">
      <section className="py-20 bg-white">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Partner With Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our network of trusted partners and be part of Kenya's
              leading beverage company
            </p>
          </div>
        </Container>
      </section>

      {/* Partner Types Section */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stockist Card */}
            <Link href="/partner/stockist" className="group">
              <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-[#0E0E96]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Stockist</h3>
                <p className="text-gray-600 mb-4">
                  Join our network of stockists and benefit from competitive
                  pricing and reliable supply
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  Learn More
                </button>
              </div>
            </Link>

            {/* Retailer Card */}
            <Link href="/contact/stockist" className="group">
              <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-[#0E0E96]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Retailer</h3>
                <p className="text-gray-600 mb-4">
                  Stock our premium beverages in your store and offer your
                  customers quality refreshment
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Partner With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              As a partner of SBC Kenya, you'll enjoy numerous benefits and
              opportunities for growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit Card 1 */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[#0E0E96]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Competitive Pricing
              </h3>
              <p className="text-gray-600">
                Enjoy competitive pricing structures designed to maximize your
                profitability
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[#0E0E96]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">
                Supply your customers with world-class beverages that meet the
                highest quality standards
              </p>
            </div>

            {/* Benefit Card 3 */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[#0E0E96]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Marketing Support</h3>
              <p className="text-gray-600">
                Receive comprehensive marketing support to boost your business
                growth
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
