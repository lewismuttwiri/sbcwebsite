"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Container from "@/components/layout/Container";
import toast from "react-hot-toast";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaWhatsapp } from "react-icons/fa6";

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

const whatsappSchema = z.object({
  whatsappName: z.string().min(1, "Name is required"),
  whatsappEmail: z.string().email("Please enter a valid email address"),
  whatsappMessage: z.string().min(1, "Please enter your message"),
});

type WhatsAppData = z.infer<typeof whatsappSchema>;

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    register: registerWhatsApp,
    handleSubmit: handleWhatsAppSubmit,
    formState: { errors: whatsappErrors },
    reset: resetWhatsApp,
  } = useForm<WhatsAppData>({
    resolver: zodResolver(whatsappSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setError("");

    try {
      const body = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        message: data.message,
        subject: data.subject,
      };
      const response = await fetch(`/api/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return console.error("Failed to send message");
      }

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

  const onWhatsAppSubmit = async (data: WhatsAppData) => {
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setError("");

    try {
      const whatsappNumber = "254730301021";
      const { whatsappName: name, whatsappEmail: email, whatsappMessage: message } = data;

      const formattedMessage = `Hello,%0A%0AName: ${encodeURIComponent(
        name.trim()
      )}%0AEmail: ${encodeURIComponent(
        email.trim()
      )}%0A%0AMessage:%0A${encodeURIComponent(
        message.trim()
      )}`;

      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Open WhatsApp with the pre-filled message
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${formattedMessage}`;
      const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        throw new Error('Failed to open WhatsApp. Please ensure pop-ups are allowed for this site.');
      }
      
      // Show success message and reset form
      setSubmissionSuccess(true);
      toast.success("WhatsApp is opening with your message");
      resetWhatsApp();
    } catch (error) {
      console.error("Error with WhatsApp submission:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to open WhatsApp. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
 };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab('email')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'email' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                      Email Us
                    </button>
                    <button
                      onClick={() => setActiveTab('whatsapp')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'whatsapp' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                      Chat on WhatsApp
                    </button>
                  </nav>
                </div>

                <div className="md:flex">
                  <div className="p-8 w-full">
                    {activeTab === 'email' ? (
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
                          className="w-full bg-[#0E0E96] text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chat with Us on WhatsApp</h2>
                          <p className="text-gray-600">Get instant responses from our team</p>
                        </div>

                        <form onSubmit={handleWhatsAppSubmit(onWhatsAppSubmit)} className="space-y-6">
                          <div>
                            <label htmlFor="whatsappName" className="block text-sm font-medium text-gray-700 mb-1">
                              Your Name *
                            </label>
                            <input
                              type="text"
                              id="whatsappName"
                              {...registerWhatsApp("whatsappName")}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                whatsappErrors.whatsappName ? "border-red-500" : "border-gray-300"
                              }`}
                              placeholder="Enter your name"
                            />
                            {whatsappErrors.whatsappName && (
                              <p className="mt-1 text-sm text-red-600">
                                {whatsappErrors.whatsappName.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="whatsappEmail" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              id="whatsappEmail"
                              {...registerWhatsApp("whatsappEmail")}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                whatsappErrors.whatsappEmail ? "border-red-500" : "border-gray-300"
                              }`}
                              placeholder="your.email@example.com"
                            />
                            {whatsappErrors.whatsappEmail && (
                              <p className="mt-1 text-sm text-red-600">
                                {whatsappErrors.whatsappEmail.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="whatsappMessage" className="block text-sm font-medium text-gray-700 mb-1">
                              Your Message *
                            </label>
                            <textarea
                              id="whatsappMessage"
                              rows={4}
                              {...registerWhatsApp("whatsappMessage")}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                whatsappErrors.whatsappMessage ? "border-red-500" : "border-gray-300"
                              }`}
                              placeholder="How can we help you?"
                            ></textarea>
                            {whatsappErrors.whatsappMessage && (
                              <p className="mt-1 text-sm text-red-600">
                                {whatsappErrors.whatsappMessage.message}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center">
                            <button
                              type="submit"
                              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0E0E96] focus:outline-none focus:ring-2 focus:ring-offset-2  w-full"
                            >
                              <FaWhatsapp size={20} color="white" className="mr-2" />
                              Open WhatsApp Chat
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
