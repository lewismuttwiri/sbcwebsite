"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";

// Helper function to check if user has procurement role
const hasProcurementRole = (user: any): boolean => {
  // Assuming procurement role has user_role === 4 (adjust based on your actual role system)
  return user?.user_role === 4;
};

interface Tender {
  id: number;
  tenderNumber: string;
  description: string;
  document: string;
  additionalInfo: string;
  closingDate: string;
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isProcurement = isAuthenticated && hasProcurementRole(user);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/tenders");
        console.log("Tenders response", response);

        if (!response.ok) {
          throw new Error("Failed to fetch tenders");
        }

        const data = await response.json();
        console.log("data", data);
        setTenders(data || []);
      } catch (err) {
        console.error("Error fetching tenders:", err);
        setError("Failed to load tenders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenders();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Current Tenders</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC", // This ensures the date is not affected by timezone
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Check if tender is closing soon (within 7 days)
  const isClosingSoon = (closingDate: string) => {
    const today = new Date();
    const closing = new Date(closingDate);
    const diffTime = closing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0; // Within next 7 days and not in past
  };

  // Check if tender is closed
  const isClosed = (closingDate: string) => {
    const today = new Date();
    const closing = new Date(closingDate);
    return closing < today;
  };

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle tender deletion
  const handleDeleteTender = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this tender?")) {
      try {
        const response = await fetch(`/api/tenders/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete tender");
        }

        // Refresh the tenders list
        const updatedTenders = tenders.filter((tender) => tender.id !== id);
        setTenders(updatedTenders);
      } catch (err) {
        console.error("Error deleting tender:", err);
        setError("Failed to delete tender. Please try again.");
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Current Tenders</h1>
          {isProcurement && (
            <div className="mt-4 sm:mt-0">
              <Link
                href="/tenders/add"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add New Tender
              </Link>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {tenders.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No tenders
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are currently no active tenders.
                  {isProcurement && (
                    <span>
                      {" "}
                      Click the 'Add New Tender' button to create one.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul role="list" className="space-y-6">
              {tenders.map((tender) => (
                <li
                  key={tender.id}
                  className="hover:bg-gray-50 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {tender.tenderNumber} - {tender.description}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isClosed(tender.closingDate)
                              ? "bg-red-100 text-red-800"
                              : isClosingSoon(tender.closingDate)
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {isClosed(tender.closingDate)
                            ? `Closed on ${formatDate(tender.closingDate)}`
                            : isClosingSoon(tender.closingDate)
                            ? `Closes soon: ${formatDate(tender.closingDate)}`
                            : `Closes: ${formatDate(tender.closingDate)}`}
                        </p>
                      </div>
                    </div>

                    {tender.additionalInfo && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {tender.additionalInfo}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      {tender.document ? (
                        <a
                          href={tender.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 mb-2 sm:mb-0"
                        >
                          <svg
                            className="h-4 w-4 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Download Tender Document
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">
                          No document attached
                        </span>
                      )}

                      {isProcurement && (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/tenders/edit/${tender.id}`)
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTender(tender.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Current Tenders</h1>
        {isProcurement && (
          <div className="mt-4 sm:mt-0">
            <Link
              href="/tenders/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add New Tender
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {tenders.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No tenders
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                There are currently no active tenders.
                {isProcurement && (
                  <span> Click the 'Add New Tender' button to create one.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul role="list" className="divide-y divide-gray-200">
            {tenders.map((tender) => (
              <li key={tender.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {tender.tenderNumber} - {tender.description}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isClosed(tender.closingDate)
                            ? "bg-red-100 text-red-800"
                            : isClosingSoon(tender.closingDate)
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isClosed(tender.closingDate)
                          ? `Closed on ${formatDate(tender.closingDate)}`
                          : isClosingSoon(tender.closingDate)
                          ? `Closes soon: ${formatDate(tender.closingDate)}`
                          : `Closes: ${formatDate(tender.closingDate)}`}
                      </p>
                    </div>
                  </div>

                  {tender.additionalInfo && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {tender.additionalInfo}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    {tender.document ? (
                      <a
                        href={tender.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 mb-2 sm:mb-0"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Download Tender Document
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500">
                        No document attached
                      </span>
                    )}

                    {isProcurement && (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/tenders/edit/${tender.id}`)
                          }
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTender(tender.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              For any inquiries regarding the tenders, please contact the
              procurement department at{" "}
              <a
                href="mailto:procurement@sbckenya.com"
                className="font-medium underline"
              >
                procurement@sbckenya.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
