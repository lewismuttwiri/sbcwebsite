"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Container from "@/components/layout/Container";
import Button from "@/components/Button";
import * as z from "zod";

// type DistributorFormData = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   businessName: string;
//   businessType: string;
//   county: string;
//   subCounty: string;
//   town: string;
//   message?: string;
// };

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(1, "Message is required"),
  phone: z.string().min(1, "Phone number is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  county: z.string().min(1, "County is required"),
  subCounty: z.string().min(1, "Sub-county is required"),
  town: z.string().min(1, "Town is required"),
});

type DistributorFormData = z.infer<typeof formSchema>;

export default function ContactDistributorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DistributorFormData>();

  const onSubmit: SubmitHandler<DistributorFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setError("");

    try {
      // Validate the API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured");
      }

      const response = await fetch(
        `${apiUrl}contact/api/distributor-contacts/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            message: data.message,
            phone: data.phone,
            business_name: data.businessName,
            business_type: data.businessType,
            county: data.county,
            sub_county: data.subCounty,
            town: data.town,
          }),
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(
            `Request failed with status ${response.status}: ${response.statusText}`
          );
        }
        if (response.status === 400 && errorData) {
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
          errorData.detail || errorData.message || "An error occurred"
        );
      }

      const responseData = await response.json().catch(() => ({}));
      console.log("Message submitted successfully:", responseData);
      setSubmissionSuccess(true);
      toast.success(
        "Your request has been submitted successfully! A stockist will contact you soon."
      );
      reset(); // Reset form fields
      router.push("/contact/thank-you");
    } catch (error) {
      console.error("Message submission error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <Container className="px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8 md:px-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Find a stockist Near You
              </h1>
              <p className="text-gray-600">
                Fill out the form below and we'll connect you with a stockist in
                your area.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[+]?[0-9\s-]+$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., +254 700 123456"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    {...register("businessName", {
                      required: "Business name is required",
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.businessName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="businessType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type of Business <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="businessType"
                    {...register("businessType", {
                      required: "Please select a business type",
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.businessType ? "border-red-500" : "border-gray-300"
                    }`}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select business type
                    </option>
                    <option value="retail">Retail Store</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="hotel">Hotel/Restaurant</option>
                    <option value="bar">Bar/Nightclub</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.businessType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.businessType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="county"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    County <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="county"
                    type="text"
                    {...register("county", {
                      required: "County is required",
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.county ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Nairobi"
                  />
                  {errors.county && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.county.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subCounty"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sub-County <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subCounty"
                    type="text"
                    {...register("subCounty", {
                      required: "Sub-county is required",
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.subCounty ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Westlands"
                  />
                  {errors.subCounty && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subCounty.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="town"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Town/Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="town"
                    type="text"
                    {...register("town", {
                      required: "Town/Area is required",
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.town ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Lavington"
                  />
                  {errors.town && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.town.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Information (Optional)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register("message")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us more about your business needs..."
                />
              </div>

              <div className="flex items-center">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full md:w-auto px-8 py-3 text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Find a Stockist"}
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                By submitting this form, you agree to our{" "}
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </a>
                . We'll never share your information with third parties without
                your permission.
              </p>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
