"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DistributorThankYou() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Application Received!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for applying to become a distributor. Our team will review
          your application and get back to you within 2-3 business days. You'll
          receive an email with further instructions once your application is
          processed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" passHref>
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/partner/dashboard" passHref>
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
