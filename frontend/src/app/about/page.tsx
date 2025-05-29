"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our journey of excellence in beverage production and our
              commitment to sustainable growth in Kenya.
            </p>
          </div>
        </Container>
      </section>

      {/* Navigation Links */}
      <section className="py-12 bg-white">
        <Container className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/about/history" className="group">
              <div className="p-6 rounded-lg border border-gray-200 hover:border-blue-600 transition-colors">
                <h3 className="text-xl font-semibold mb-2">Our History</h3>
                <p className="text-gray-600">
                  Explore our journey from foundation to present day
                </p>
              </div>
            </Link>
            <Link href="/about/mission-and-vision" className="group">
              <div className="p-6 rounded-lg border border-gray-200 hover:border-blue-600 transition-colors">
                <h3 className="text-xl font-semibold mb-2">Mission & Vision</h3>
                <p className="text-gray-600">
                  Discover our guiding principles and goals
                </p>
              </div>
            </Link>
            <Link href="/about/quality-assurance" className="group">
              <div className="p-6 rounded-lg border border-gray-200 hover:border-blue-600 transition-colors">
                <h3 className="text-xl font-semibold mb-2">
                  Quality Assurance
                </h3>
                <p className="text-gray-600">
                  Learn about our commitment to excellence
                </p>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-lg text-gray-700">
                Seven Up Bottling Company (SBC) Kenya is a leading beverage
                company and the official bottler of PepsiCo beverages in Kenya.
                Founded with a vision to deliver world-class beverages to the
                Kenyan market, we have grown to become a cornerstone of the
                beverage industry in East Africa.
              </p>
              <p className="text-lg text-gray-700">
                Our state-of-the-art production facilities and commitment to
                quality have made us a trusted partner for PepsiCo, ensuring
                that every bottle of Pepsi, Mountain Dew, 7UP, and Mirinda that
                reaches our consumers meets the highest international standards.
              </p>
            </div>
            <div className="relative h-[400px] md:h-[500px] w-full">
              <Image
                src="/images/factory/factory-six.jpg"
                alt="SBC Kenya Factory"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Our Mission & Values */}
      <section className="py-20 bg-white">
        <Container className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] md:h-[500px] w-full">
              <Image
                src="/images/factory/factory-two.jpg"
                alt="SBC Kenya Production Line"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Our Mission & Values
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Quality First
                    </h3>
                    <p className="text-gray-700">
                      We maintain the highest standards of quality in our
                      production processes, ensuring every product meets
                      international standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Sustainability
                    </h3>
                    <p className="text-gray-700">
                      We are committed to sustainable practices that minimize
                      our environmental impact while maximizing social benefits.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                    <p className="text-gray-700">
                      We continuously innovate in our production processes and
                      product offerings to stay ahead in the beverage industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Impact */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how we contribute to the Kenyan economy and society
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Economic Growth</h3>
              <p className="text-gray-600">
                We contribute significantly to Kenya's economy through job
                creation and local sourcing of materials.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">
                We actively support local communities through various
                initiatives and partnerships.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Environmental Stewardship
              </h3>
              <p className="text-gray-600">
                We implement sustainable practices to minimize our environmental
                footprint and promote recycling.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
