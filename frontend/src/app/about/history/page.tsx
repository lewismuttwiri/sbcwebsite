"use client";

import Image from "next/image";
import Container from "@/components/layout/Container";

export default function HistoryPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our History</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A journey of growth and excellence in the Kenyan beverage industry
            </p>
          </div>
        </Container>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Timeline Item 1 */}
              <div className="border-l-2 border-gray-200 pl-8">
                <div className="-ml-8 mr-12">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="relative w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">2013</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Company Foundation
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Seven Up Bottling Company Kenya was established as the
                        official bottler of PepsiCo beverages in Kenya.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="border-l-2 border-gray-200 pl-8">
                <div className="-ml-8 mr-12">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="relative w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">2015</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Expansion Phase
                      </h3>
                      <p className="mt-2 text-gray-600">
                        SBC Kenya expanded its production capacity and
                        introduced new beverage lines to the Kenyan market.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              {/* <div className="border-l-2 border-gray-200 pl-8">
                <div className="-ml-8 mr-12">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="relative w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">2018</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Modernization
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Implementation of  production facilities
                        and sustainability initiatives.
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Timeline Item 4 */}
              <div className="border-l-2 border-gray-200 pl-8">
                <div className="-ml-8 mr-12">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="relative w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">2024</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Current Era
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Leading the way in sustainable beverage production and
                        community engagement.
                      </p>
                    </div>
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
