import Container from "@/components/layout/Container";

export default function OrderLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>

              <div className="px-4 py-5 sm:p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>

                {/* Order items skeleton */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-4 py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-4 bg-gray-200 rounded w-full"
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-4 bg-gray-200 rounded w-full"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
