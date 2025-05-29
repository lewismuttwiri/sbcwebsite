// app/careers/jobs/apply/thank-you/page.tsx
import { Suspense } from "react";
import ThankYouContent from "./ThankYouContent";

function ThankYouLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-200 animate-pulse">
            <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-80 mx-auto animate-pulse"></div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouLoading />}>
      <ThankYouContent />
    </Suspense>
  );
}
