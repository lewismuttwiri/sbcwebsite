"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "@/components/layout/Container";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { apply_distributor } from "@/utils/partnership";

export default function DistributorApplication() {
  const router = useRouter();

  // Define the type for the form data
  interface FormDataState {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    businessName: string;
    businessRegistration: File | null;
    krapin: File | null;
    distributionArea: string;
    idFront: File | null;
    idBack: File | null;
  }

  // Type for file input fields in the form
  type FileField = "businessRegistration" | "krapin" | "idFront" | "idBack";

  const [formData, setFormData] = useState<FormDataState>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    businessName: "",
    businessRegistration: null,
    krapin: null,
    distributionArea: "",
    idFront: null,
    idBack: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: FileField
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [field]: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic form validation
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phoneNumber ||
        !formData.businessName ||
        !formData.idFront ||
        !formData.idBack ||
        !formData.businessRegistration ||
        !formData.krapin
      ) {
        toast(
          "Please fill in all required fields and upload all required documents"
        );
        return;
      }
      console.log("Form data being sent:");

      // Create FormData object for file uploads
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("phone_number", formData.phoneNumber);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("company_name", formData.businessName);
      formDataToSend.append(
        "distribution_area",
        formData.distributionArea || ""
      );

      // Append files - we've already validated they exist
      if (formData.idFront) {
        formDataToSend.append("id_front", formData.idFront);
      }

      if (formData.idBack) {
        formDataToSend.append("id_back", formData.idBack);
      }

      if (formData.businessRegistration) {
        formDataToSend.append(
          "business_license",
          formData.businessRegistration
        );
      }

      if (formData.krapin) {
        formDataToSend.append("tax_certificate", formData.krapin);
      }

      // Log FormData entries for debugging
      console.log("Form data being sent:");
      for (let pair of (formDataToSend as any).entries()) {
        console.log(
          `${pair[0]}:`,
          pair[1] instanceof File ? pair[1].name : pair[1]
        );
      }
      console.log(formData);
      console.log("Form data to send:", formDataToSend);
      // Send the request to the partner API
      await apply_distributor(formDataToSend);

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        businessName: "",
        businessRegistration: null,
        krapin: null,
        distributionArea: "",
        idFront: null,
        idBack: null,
      });

      // Show success message (handled by apply_distributor)
    } catch (error: any) {
      console.error("Error in form submission:", error);
      toast("Error submitting application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 bg-white">
        <Container className="px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Stockist Application
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Apply to become an official stockist of SBC Kenya
            </p>
          </div>
        </Container>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                      pattern="[0-9]{10}"
                    />
                    <p className="text-sm text-gray-500">
                      Please enter your 10-digit phone number
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Business Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distribution Area
                  </label>
                  <input
                    type="text"
                    name="distributionArea"
                    value={formData.distributionArea}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Registration Document
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(e, "businessRegistration")
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Please upload your business registration document (PDF, JPG,
                    or PNG)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KRA Pin
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "krapin")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Please upload your business KRA pin (PDF, JPG, or PNG)
                  </p>
                </div>
              </div>

              {/* ID Documents */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">ID Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Front Side
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "idFront")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Please upload the front side of your ID (JPG or PNG)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Back Side
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "idBack")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Please upload the back side of your ID (JPG or PNG)
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </main>
  );
}
