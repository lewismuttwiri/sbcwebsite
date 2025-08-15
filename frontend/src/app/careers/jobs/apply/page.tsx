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
} from "react-icons/fi";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { MdOutlineCancel } from "react-icons/md";

// Types
interface FormData {
  job_advertisement: number;
  applicant_name: string;
  email: string;
  phone: string;
  resume_url?: string;
  cover_letter: string;
  skills: string[];
  experience: string;
  resume: File | null;
}

// Constants
const INITIAL_FORM_DATA: FormData = {
  job_advertisement: 0,
  applicant_name: "",
  email: "",
  phone: "",
  resume_url: "",
  cover_letter: "",
  skills: [],
  experience: "",
  resume: null,
};

// Custom hook for job application logic
const useJobApplication = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobTitle, setJobTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [currentSkill, setCurrentSkill] = useState("");

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    const jobTitleParam = searchParams.get("jobTitle");

    if (jobId) {
      setFormData((prev) => ({
        ...prev,
        job_advertisement: parseInt(jobId),
      }));
    }

    if (jobTitleParam) {
      setJobTitle(decodeURIComponent(jobTitleParam));
    }
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file") {
      handleFileChange(e as React.ChangeEvent<HTMLInputElement>);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleAddSkill = (
    e: React.KeyboardEvent<HTMLInputElement> | { key: string }
  ) => {
    if (e.key === "Enter" && currentSkill.trim()) {
      if ("preventDefault" in e) {
        e.preventDefault();
      }

      if (!formData.skills.includes(currentSkill.trim())) {
        const newSkills = [...formData.skills, currentSkill.trim()];
        setFormData((prev) => ({
          ...prev,
          skills: newSkills,
        }));
        setCurrentSkill("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const jobId = searchParams.get("jobId");
      if (!jobId) {
        throw new Error("Job ID is required");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("job_advertisement", jobId);
      formDataToSend.append("applicant_name", formData.applicant_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("position", jobTitle);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("cover_letter", formData.cover_letter);
      formDataToSend.append("experience", formData.experience);

      // Add skills as JSON string or individual entries based on your API
      formDataToSend.append("skills", JSON.stringify(formData.skills));

      if (formData.resume) {
        formDataToSend.append("resume_url", formData.resume);
      }

      if (
        !formData.applicant_name ||
        !formData.email ||
        !formData.phone ||
        !formData.cover_letter ||
        !formData.experience ||
        !formData.skills.length
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (formData.resume === null) {
        formDataToSend.append("resume_url", "");
      }

      console.log(
        "Sending this formDataToSend to the proxy server",
        formDataToSend
      );

      const response = await fetch(`/api/careers/apply/`, {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

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
          errorData?.detail ||
            errorData?.message ||
            `Request failed with status ${response.status}`
        );
      }

      router.push(`/careers/jobs/apply/thank-you`);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "There was an error submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    jobTitle,
    formData,
    currentSkill,
    isSubmitting,
    setCurrentSkill,
    handleInputChange,
    handleAddSkill,
    removeSkill,
    submitApplication,
    router,
  };
};

// Component for skills input
const SkillsInput = ({
  skills,
  currentSkill,
  onCurrentSkillChange,
  onAddSkill,
  onRemoveSkill,
}: {
  skills: string[];
  currentSkill: string;
  onCurrentSkillChange: (value: string) => void;
  onAddSkill: (e: React.KeyboardEvent) => void;
  onRemoveSkill: (skill: string) => void;
}) => (
  <div>
    <div className="flex items-end gap-2 w-full">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills
        </label>
        <input
          type="text"
          value={currentSkill}
          onChange={(e) => onCurrentSkillChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddSkill(e);
            }
          }}
          enterKeyHint="done"
          inputMode="text"
          className="shadow-sm focus:border-primary block sm:text-sm border-gray-300 rounded-md p-2 border"
          placeholder="Type a skill and press Enter"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
            const event = { key: "Enter" } as React.KeyboardEvent;
            onAddSkill(event);
          }
        }}
        className="bg-[#3b3b51] text-white px-4 py-2 rounded-md sm:hidden"
      >
        Add
      </button>
    </div>
    <div className="mt-2 flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center px-3 py-1 rounded-md text-md font-medium bg-[#0E0E96] text-white"
        >
          {skill}
          <button
            type="button"
            onClick={() => onRemoveSkill(skill)}
            className="ml-1.5 inline-flex gap-2 items-center justify-center  text-white hover:text-blue-600 focus:outline-none"
          >
            <span className="sr-only">Remove {skill}</span>
            <MdOutlineCancel />
          </button>
        </span>
      ))}
    </div>
  </div>
);

// Main Form Component
function JobApplicationForm() {
  const {
    jobTitle,
    formData,
    currentSkill,
    isSubmitting,
    setCurrentSkill,
    handleInputChange,
    handleAddSkill,
    removeSkill,
    submitApplication,
    router,
  } = useJobApplication();

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
          <form onSubmit={submitApplication} className="p-6 space-y-8">
            {jobTitle && (
              <div className="mb-6 p-4 bg-blue-50 rounded-md">
                <h2 className="text-lg font-medium text-blue-800">
                  Applying for: {jobTitle}
                </h2>
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Full Name *"
                  id="applicant_name"
                  name="applicant_name"
                  type="text"
                  required
                  value={formData.applicant_name}
                  onChange={handleInputChange}
                  icon={FiUser}
                  placeholder="Your full name"
                />
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email *"
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={FiMail}
                />
                <Input
                  label="Phone *"
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  icon={FiPhone}
                  placeholder="+254 700 000000"
                />
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Cover Letter
              </h2>
              <div>
                <label
                  htmlFor="cover_letter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cover Letter
                </label>
                <textarea
                  id="cover_letter"
                  name="cover_letter"
                  rows={6}
                  value={formData.cover_letter}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-primary focus:border-primary mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Write a cover letter explaining why you're a good fit for this position"
                />
              </div>
            </div>

            {/* Application Details */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Application Details
              </h2>
              <div className="space-y-6">
                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume
                  </label>
                  <label
                    htmlFor="resume-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                  >
                    <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <FiUpload className="mr-2 h-4 w-4" />
                      {formData.resume ? formData.resume.name : "Upload Resume"}
                    </span>
                    <input
                      id="resume-upload"
                      name="resume"
                      type="file"
                      className="sr-only"
                      onChange={handleInputChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, DOC, or DOCX (Max. 5MB)
                  </p>
                </div>

                {/* Skills */}
                <SkillsInput
                  skills={formData.skills}
                  currentSkill={currentSkill}
                  onCurrentSkillChange={setCurrentSkill}
                  onAddSkill={handleAddSkill}
                  onRemoveSkill={removeSkill}
                />

                {/* Experience */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Experience
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    rows={4}
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-primary focus:border-primary mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="Describe your relevant experience"
                  />
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

// Loading Component
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
