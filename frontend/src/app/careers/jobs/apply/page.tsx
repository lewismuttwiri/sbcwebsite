"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiChevronLeft,
  FiUpload,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiLink,
  FiFileText,
  FiEdit,
  FiGlobe,
  FiDollarSign as FiDollar,
  FiCalendar as FiCal,
} from "react-icons/fi";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  position: string;
  resume: File | null;
  coverLetter: string;
  linkedinProfile: string;
  portfolio: string;
  salaryExpectations: number;
  availableStartDate: string;
  isAuthorizedToWork: boolean;
  isWillingToRelocate: boolean;
  isVeteran: boolean;
  hasDisability: boolean;
  disabilityDetails: string;
  howDidYouHear: string;
  additionalInfo: string;
};

// Helper function to get job details by ID
const getJobById = (id: string) => {
  // In a real app, you would fetch this from your API
  const jobs = [
    {
      id: "1",
      title: "Sales Representative",
    },
    {
      id: "2",
      title: "Marketing Manager",
    },
    {
      id: "3",
      title: "Customer Support Specialist",
    },
  ];
  return jobs.find((job) => job.id === id) || { title: "" };
};

// Separate component that uses useSearchParams
function JobApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobTitle, setJobTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Kenya",
    position: "",
    resume: null,
    coverLetter: "",
    linkedinProfile: "",
    portfolio: "",
    salaryExpectations: 0,
    availableStartDate: "",
    isAuthorizedToWork: true,
    isWillingToRelocate: false,
    isVeteran: false,
    hasDisability: false,
    disabilityDetails: "",
    howDidYouHear: "",
    additionalInfo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : null,
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Get job ID from URL and fetch job details
  useEffect(() => {
    const jobId = searchParams.get("jobId");
    if (jobId) {
      const job = getJobById(jobId);
      setJobTitle(job.title);
      // Pre-fill the position field
      setFormData((prev) => ({
        ...prev,
        position: job.title,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const jobId = searchParams.get("jobId");
      const applicationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
        position: jobTitle || formData.position,
        linkedin_profile: formData.linkedinProfile,
        portfolio: formData.portfolio,
        salary_expectations: formData.salaryExpectations,
        available_start_date: formData.availableStartDate,
        is_authorized_to_work: formData.isAuthorizedToWork,
        is_willing_to_relocate: formData.isWillingToRelocate,
        is_veteran: formData.isVeteran,
        has_disability: formData.hasDisability,
        disability_details: formData.disabilityDetails,
        how_did_you_hear: formData.howDidYouHear,
        additional_info: formData.additionalInfo,
        job_id: jobId,
        cover_letter: formData.coverLetter,
      };

      // Create FormData for file upload
      const formDataToSend = new FormData();
      if (formData.resume) {
        formDataToSend.append("resume", formData.resume);
      }

      // Submit to the Django API endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}api/careers/apply/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Uncomment and implement if using Django's CSRF protection
          // 'X-CSRFToken': getCookie('csrftoken') || '',
        },
        credentials: "include", // Important for cookies/sessions
        body: JSON.stringify(applicationData),
      });

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData;
        try {
          // Try to parse error response as JSON
          errorData = await response.json();
        } catch (e) {
          // If response is not JSON, use status text
          throw new Error(
            `Request failed with status ${response.status}: ${response.statusText}`
          );
        }

        // Handle specific error cases
        if (response.status === 400 && errorData) {
          // Handle validation errors from the server
          const errorMessages = Object.entries(errorData)
            .map(
              ([field, errors]) =>
                `${field}: ${
                  Array.isArray(errors) ? errors.join(", ") : errors
                }`
            )
            .join("\n");
          throw new Error(errorMessages || "Validation failed");
        }

        throw new Error(
          errorData.detail ||
            errorData.message ||
            "Failed to submit application"
        );
      }

      const result = await response.json().catch(() => ({}));
      console.log("Application submitted successfully:", result);

      // Show success message and redirect
      const redirectUrl = jobId
        ? `/careers/apply/thank-you?jobTitle=${encodeURIComponent(
            jobTitle || formData.position
          )}`
        : "/careers/apply/thank-you";

      router.push(redirectUrl);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(
        error instanceof Error
          ? error.message
          : "There was an error submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/careers"
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <FiChevronLeft className="mr-1" /> Back to Careers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Job Application
          </h1>
          <p className="mt-2 text-gray-600">
            Fill out the form below to apply for this position.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="First Name *"
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    icon={FiUser}
                  />
                </div>
                <div>
                  <Input
                    label="Last Name *"
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    icon={FiUser}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Email *"
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    icon={FiMail}
                  />
                </div>
                <div>
                  <Input
                    label="Phone *"
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    icon={FiPhone}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Address
              </h2>
              <div className="space-y-4">
                <div>
                  <Input
                    label="Address *"
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    icon={FiMapPin}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Input
                      label="City *"
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      icon={FiMapPin}
                    />
                  </div>
                  <div>
                    <Input
                      label="State/Province *"
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      icon={FiMapPin}
                    />
                  </div>
                  <div>
                    <Input
                      label="ZIP/Postal Code *"
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      icon={FiMapPin}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    >
                      <option value="Kenya">Kenya</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiGlobe className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Position */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Position
              </h2>
              <div>
                <Input
                  label="Position You're Applying For *"
                  id="position"
                  name="position"
                  type="text"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  icon={FiBriefcase}
                  disabled={!!jobTitle}
                />
              </div>
            </div>

            {/* Resume & Cover Letter */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Resume & Cover Letter
              </h2>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="resume"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Resume *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="resume-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                        >
                          <span>Upload a file</span>
                          <input
                            id="resume-upload"
                            name="resume"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                            accept=".pdf,.doc,.docx"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX up to 5MB
                      </p>
                      {formData.resume && (
                        <p className="text-sm text-gray-900 mt-2">
                          Selected: {formData.resume.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Input
                    label="Cover Letter"
                    id="coverLetter"
                    name="coverLetter"
                    type="textarea"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    icon={FiEdit}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Additional Information
              </h2>
              <div className="space-y-6">
                <div>
                  <Input
                    label="LinkedIn Profile"
                    id="linkedinProfile"
                    name="linkedinProfile"
                    type="url"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    icon={FiLink}
                  />
                </div>
                <div>
                  <Input
                    label="Portfolio/Website"
                    id="portfolio"
                    name="portfolio"
                    type="url"
                    value={formData.portfolio}
                    onChange={handleChange}
                    icon={FiLink}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="relative">
                      <Input
                        label="Salary Expectations (Monthly)"
                        id="salaryExpectations"
                        name="salaryExpectations"
                        type="number"
                        value={formData.salaryExpectations}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="pl-10"
                      />
                      <span className="absolute right-30 top-9 text-gray-500 text-sm">
                        KSh
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Input
                        label="Available Start Date"
                        id="availableStartDate"
                        name="availableStartDate"
                        type="date"
                        value={formData.availableStartDate}
                        onChange={handleChange}
                        icon={FiCal}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isAuthorizedToWork"
                        name="isAuthorizedToWork"
                        type="checkbox"
                        checked={formData.isAuthorizedToWork}
                        onChange={handleChange}
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="isAuthorizedToWork"
                        className="font-medium text-gray-700"
                      >
                        Are you legally authorized to work in Kenya?
                      </label>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isWillingToRelocate"
                        name="isWillingToRelocate"
                        type="checkbox"
                        checked={formData.isWillingToRelocate}
                        onChange={handleChange}
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="isWillingToRelocate"
                        className="font-medium text-gray-700"
                      >
                        Are you willing to relocate if required?
                      </label>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="hasDisability"
                        name="hasDisability"
                        type="checkbox"
                        checked={formData.hasDisability}
                        onChange={handleChange}
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="hasDisability"
                        className="font-medium text-gray-700"
                      >
                        Do you have a disability?
                      </label>
                    </div>
                  </div>
                  {formData.hasDisability && (
                    <div className="ml-7">
                      <label
                        htmlFor="disabilityDetails"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Please provide details
                      </label>
                      <textarea
                        id="disabilityDetails"
                        name="disabilityDetails"
                        rows={3}
                        value={formData.disabilityDetails}
                        onChange={handleChange}
                        className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="howDidYouHear"
                    className="block text-sm font-medium text-gray-700"
                  >
                    How did you hear about this position?
                  </label>
                  <select
                    id="howDidYouHear"
                    name="howDidYouHear"
                    value={formData.howDidYouHear}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  >
                    <option value="">Select an option</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Job Board">Job Board</option>
                    <option value="Company Website">Company Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <div className="relative">
                    <label
                      htmlFor="additionalInfo"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Additional Information
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      rows={4}
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
              >
                Cancel
              </Button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component wrapped with Suspense
export default function JobApplicationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <JobApplicationForm />
    </Suspense>
  );
}
