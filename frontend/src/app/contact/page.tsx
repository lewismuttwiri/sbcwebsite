"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Container from "@/components/layout/Container";
import toast from "react-hot-toast";
import Link from "next/link";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/components/contact/LocationMap"), {
  ssr: false,
});

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(1, "Message is required"),
  subject: z.string().min(1, "Subject is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setError("");

    try {
      // Validate the API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured");
      }

      const response = await fetch(`${apiUrl}contact/api/comments/`, {
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
          subject: data.subject,
        }),
      });

      // Handle non-2xx responses
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

      // Handle successful response
      const responseData = await response.json().catch(() => ({}));
      console.log("Message submitted successfully:", responseData);
      setSubmissionSuccess(true);
      toast.success("Message submitted successfully");
      reset();
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
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-16">
          <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

          <div className="max-w-2xl mx-auto">
            {submissionSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-8">
                <p>Thank you for your message! We will get back to you soon.</p>
                <button
                  onClick={() => setSubmissionSuccess(false)}
                  className="mt-2 text-green-700 hover:text-green-900 font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      {...register("firstName")}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your first name"
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
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      {...register("lastName")}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      {...register("subject")}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.subject ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter the subject"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      {...register("message")}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.message ? "border-red-500" : "border-gray-300"
                      }`}
                      rows={4}
                      placeholder="Enter your message"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">
              Other Contact Information
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Address</h3>
                  <p className="text-gray-600">
                    SBC Kenya Limited
                    <br />
                    P.O.BOX 76748-00620
                    <br />
                    Off Baba Dogo Road, Ruaraka Nairobi
                    <br />
                    Kenya
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Phone</h3>
                  <div className="flex space-x-2 space-y-2">
                    <Link
                      href="tel:0208635000"
                      className="text-gray-600 hover:underline"
                    >
                      0208635000
                    </Link>
                    <Link
                      href="tel:0800230055"
                      className="text-gray-600 hover:underline"
                    >
                      0800230055 (Toll Free)
                    </Link>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <Link
                    href="mailto:info@sbckenya.com"
                    className="text-gray-600 hover:underline"
                  >
                    info@sbckenya.com
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map Section */}
          <div className="mt-16">
            {/* <h2 className="text-2xl font-bold">Our Locations</h2> */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className=" w-full">
                <LocationMap />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

