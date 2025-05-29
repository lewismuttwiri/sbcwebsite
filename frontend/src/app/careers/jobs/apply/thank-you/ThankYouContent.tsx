// app/careers/jobs/apply/thank-you/ThankYouContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const title = searchParams.get("jobTitle");
    if (title) {
      setJobTitle(decodeURIComponent(title));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
            <FiCheckCircle
              className="h-12 w-12 text-green-600"
              aria-hidden="true"
            />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Application Submitted
          </h1>
          {jobTitle && (
            <p className="mt-2 text-lg text-primary font-medium">
              Position: {jobTitle}
            </p>
          )}
          <p className="mt-4 text-lg text-gray-600">
            Thank you for applying! We've received your application and will
            review it carefully.
          </p>
          <p className="mt-2 text-gray-600">
            Our team will get back to you if your qualifications match our
            requirements.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Back to Careers
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
