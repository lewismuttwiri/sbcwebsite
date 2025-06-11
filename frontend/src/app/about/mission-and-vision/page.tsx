"use client";

import Image from "next/image";
import Container from "@/components/layout/Container";

export default function MissionVisionPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Mission & Vision
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Guiding principles that shape our journey
            </p>
          </div>
        </Container>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Mission Content */}
            <div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To consistently deliver world-class beverages that refresh and
                  delight our consumers while maintaining the highest standards
                  of quality, sustainability, and social responsibility.
                </p>
                <ul className="list-disc list-inside space-y-4 text-gray-700">
                  <li>
                    <strong>Quality First:</strong> We maintain the highest
                    standards in production and service
                  </li>
                  <li>
                    <strong>Sustainability:</strong> We minimize our
                    environmental impact and promote recycling
                  </li>
                  <li>
                    <strong>Innovation:</strong> We continuously improve our
                    processes and product offerings
                  </li>
                  <li>
                    <strong>Community Impact:</strong> We actively support local
                    communities and social initiatives
                  </li>
                </ul>
              </div>
            </div>

            {/* Vision Content */}
            <div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To be the leading beverage company in East Africa, recognized
                  for excellence in quality, sustainability, and community
                  impact.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">2025 Goals</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>Expand our product portfolio</li>
                      <li>Enhance sustainability initiatives</li>
                      <li>Grow our market share</li>
                      <li>Strengthen community partnerships</li>
                    </ul>
                  </div> */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Core Values</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>Integrity</li>
                      <li>Excellence</li>
                      <li>Teamwork</li>
                      <li>Innovation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
