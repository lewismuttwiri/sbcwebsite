import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Thank You | SBC Kenya",
  description: "Thank you for contacting us. We will get back to you soon.",
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center py-16">
      <Container className="px-4">
        <div className="max-w-3xl mx-auto text-center bg-white p-8 rounded-lg shadow-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Interest!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We've received your request to connect with a distributor. Our team
            will review your information and have a distributor in your area
            contact you within 1-2 business days.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/">
              <Button variant="primary" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="primary" className="w-full sm:w-auto">
                Browse Our Products
              </Button>
            </Link>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need immediate assistance? Call us at{" "}
              <a
                href="tel:+020 8635000"
                className="text-blue-600 hover:underline"
              >
                +020 8635000
              </a>{" "}
              or email{" "}
              <a
                href="mailto:info@sbckenya.com"
                className="text-blue-600 hover:underline"
              >
                info@sbckenya.com
              </a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
