"use client";

import Image from "next/image";
import Container from "@/components/layout/Container";

export default function QualityPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Quality Assurance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence in every bottle
            </p>
          </div>
        </Container>
      </section>

      {/* Quality Standards */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Quality Process */}
            <div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Quality Process
                </h2>
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Raw Material Inspection
                      </h3>
                      <p className="text-gray-700">
                        Rigorous testing of all incoming materials to ensure
                        they meet our high standards
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Production Monitoring
                      </h3>
                      <p className="text-gray-700">
                        Continuous monitoring of production processes to
                        maintain consistent quality
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Quality Control
                      </h3>
                      <p className="text-gray-700">
                        Multiple quality checks throughout the production
                        process
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Final Inspection
                      </h3>
                      <p className="text-gray-700">
                        Comprehensive final checks before products reach
                        consumers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Certifications */}
            <div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Quality Certifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                      ISO Certifications
                    </h3>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>ISO 9001:2015 Quality Management</li>
                      <li>ISO 22000 Food Safety Management</li>
                      <li>ISO 14001 Environmental Management</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                      PepsiCo Standards
                    </h3>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>Global Quality Standards</li>
                      <li>Food Safety Protocols</li>
                      <li>Environmental Guidelines</li>
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
