"use client";

import Image from "next/image";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Button from "@/components/Button";

export default function DistributorPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      {/* <section className="py-20 bg-white">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Become a Distributor
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expand your business with Kenya's leading beverage company
            </p>
          </div>
        </Container>
      </section> */}

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Become a Distributor?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              As a distributor of SBC Kenya, you'll enjoy exclusive benefits and
              opportunities for growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Benefit Card 1 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
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
                Exclusive Territory
              </h3>
              <p className="text-gray-600">
                Receive exclusive distribution rights for your designated area
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
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
              <h3 className="text-xl font-semibold mb-2">
                Competitive Pricing
              </h3>
              <p className="text-gray-600">
                Enjoy competitive pricing structures designed to maximize your
                profitability
              </p>
            </div>

            {/* Benefit Card 3 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
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
                Receive comprehensive marketing support and promotional
                materials
              </p>
            </div>

            {/* Benefit Card 4 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
              <h3 className="text-xl font-semibold mb-2">Training & Support</h3>
              <p className="text-gray-600">
                Get comprehensive training and ongoing support from our team
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Requirements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              To become a distributor, you'll need to meet these requirements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Requirements List */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-4">Business Requirements</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Valid business registration
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Minimum capital requirement
                  </span>
                </li>
                {/* <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Proven distribution network
                  </span>
                </li> */}
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Compliance with regulations
                  </span>
                </li>
              </ul>
            </div>

            {/* Application Process */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-4">Application Process</h3>
              <ol className="space-y-2">
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <span className="text-gray-700">Submit an application</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <span className="text-gray-700">Business evaluation</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <span className="text-gray-700">Review process</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">4</span>
                  </div>
                  <span className="text-gray-700">Onboarding</span>
                </li>
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Contact our distribution team to learn more about becoming a
              distributor
            </p>
          </div>
          <div className="max-w-2xl mx-auto text-center">
            <Button variant="primary" href="/partner/distributor/apply">
              Apply Now
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
