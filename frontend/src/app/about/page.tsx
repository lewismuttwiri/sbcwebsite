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
                  We produce and distribute refreshments to delight our
                  consumers and provide a robust return to our stakeholders
                  through continual process improvement.
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
                Seven Up Bottling Company (SBC) Kenya is the official bottler of
                PepsiCo beverages in Kenya. As one of the leading beverage
                companies in the region, our portfolio includes popular brands
                such as Pepsi, Mountain Dew, 7UP, Mirinda, and Evervess. Our
                products are available in various packaging options including
                returnable glass bottles and PET plastic bottles.
              </p>
              <p className="text-lg text-gray-700">
                As a proud Kenyan company, we are committed to making a positive
                impact in our communities. Our corporate social responsibility
                initiatives focus on sports development, education,
                environmental sustainability through plastic recycling programs,
                and various community development projects across the country.
              </p>
            </div>
            <div className="relative h-[400px] md:h-[500px] w-full">
              <Image
                src="/images/factory/factory-2.jpeg"
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
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Our Mission & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] md:h-[500px] w-full">
              <Image
                src="/images/factory/factory-3.jpeg"
                alt="SBC Kenya Production Line"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
            <div className="space-y-6">
              <div className="pt-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Core Values
                </h3>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">
                      Consumer focused
                    </h4>
                    <p className="text-gray-700 mt-1">
                      Consumers are our strength and survival. We therefore
                      tailor our operations to suit their needs and
                      expectations.
                    </p>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-800">
                      Distributors & Suppliers Partners
                    </h4>
                    <p className="text-gray-700 mt-1">
                      Distributors and suppliers are our partners and we are
                      committed to maintaining a mutually beneficial
                      relationship with them, as well as other business
                      associates.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">
                      Quality First
                    </h4>
                    <p className="text-gray-700 mt-1">
                      We aim at achieving the highest international quality
                      standards in all we do.
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800">
                      Integrity & Transparency
                    </h4>
                    <p className="text-gray-700 mt-1">
                      We emphasize and pursue integrity in all our dealings and
                      operations and will not compromise on generally acceptance
                      corporate governance.
                    </p>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-800">
                      Social & environmental responsibilities
                    </h4>
                    <p className="text-gray-700 mt-1">
                      We are committed to our social and environmental
                      responsibilities.
                    </p>
                  </div>

                  <div className="bg-rose-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-rose-800">
                      People are key
                    </h4>
                    <p className="text-gray-700 mt-1">
                      We foster an enabling environment that builds teamwork,
                      trust and respect.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Impact */}
      {/* <section className="py-20 bg-gray-50">
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
      </section> */}
    </main>
  );
}
