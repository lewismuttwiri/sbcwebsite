"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import { useAuth } from "@/context/AuthContext";

interface TenderFormData {
  tenderNumber: string;
  description: string;
  additionalInfo: string;
  closingDate: string;
}

export default function AddTenderPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState<any | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserRole(JSON.parse(user)?.entity?.role.id);
    }
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<TenderFormData>({
    tenderNumber: "",
    description: "",
    additionalInfo: "",
    closingDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fix hydration mismatch by ensuring component only renders after mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Basic validation
    if (
      !formData.tenderNumber ||
      !formData.description ||
      !formData.closingDate
    ) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // File size validation (5MB max)
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form data fields
      formDataToSend.append("tenderNumber", formData.tenderNumber);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("additionalInfo", formData.additionalInfo);
      formDataToSend.append("closingDate", formData.closingDate);

      // Append the file if selected
      if (selectedFile) {
        formDataToSend.append("document", selectedFile);
      }

      const response = await fetch("/api/tenders", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to tenders list on success
      router.push("/tenders");
      router.refresh();
    } catch (err) {
      console.error("Error creating tender:", err);
      setError(err instanceof Error ? err.message : "Failed to create tender");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent hydration mismatch by not rendering auth-dependent content until mounted
  if (!isMounted) {
    return (
      <Container>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Container>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Container>
    );
  }

  // Check if user has procurement role
  if (!isAuthenticated || userRole !== 4) {
    return (
      <Container>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-8">
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
              <p className="text-sm text-red-700">
                You don't have permission to access this page. Only procurement
                staff can add tenders.
              </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Check if user is not authenticated
  if (!isAuthenticated) {
    return (
      <Container>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to be logged in to access this page.
              </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Add New Tender
        </h1>

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

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="border-b border-gray-200 pb-5">
            <h2 className="text-lg font-medium text-gray-900">
              Tender Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details of the new tender.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="tenderNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Tender Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tenderNumber"
                name="tenderNumber"
                value={formData.tenderNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="additionalInfo"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Information (optional)
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows={2}
                value={formData.additionalInfo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="closingDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Closing Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="closingDate"
                  name="closingDate"
                  value={formData.closingDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="document"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tender Document
                </label>
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Choose File
                  </label>
                  <input
                    id="document-upload"
                    name="document"
                    type="file"
                    onChange={handleFileChange}
                    className="sr-only"
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                  />
                  <span className="ml-3 text-sm text-gray-500 truncate">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </span>
                </div>
                {selectedFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}{" "}
                    KB)
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  PDF, DOC, DOCX, or images (Max 5MB)
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/tenders")}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Tender"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
}
