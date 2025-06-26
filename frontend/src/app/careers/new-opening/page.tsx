"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JobPosting } from "@/types/job";
import Container from "@/components/layout/Container";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function NewJobOpening() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [userRole, setUserRole] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          setUserRole(parsedUser.entity.role.id); // Fixed: use parsedUser instead of user
          setCsrfToken(parsedUser.entity.token);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const [jobData, setJobData] = useState<Omit<JobPosting, "id" | "posted">>({
    title: "",
    description: "",
    requirements: [""],
    responsibilities: "",
    location: "",
    department: "",
    type: "Full-time",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...jobData.requirements];
    newRequirements[index] = value;
    setJobData((prev) => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setJobData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    const newRequirements = jobData.requirements.filter((_, i) => i !== index);
    setJobData((prev) => ({ ...prev, requirements: newRequirements }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    console.log("csrfToken", csrfToken);
    console.log("jobData", jobData);

    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${api_url}careers/api/job-advertisements/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRFToken": csrfToken || "",
          },
          body: JSON.stringify(jobData),
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      console.log("data", data);
      console.log("Response status:", response);

      toast.success("Job opening created successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking user data
  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </Container>
    );
  }

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

  if (userRole !== null && ![1, 2].includes(userRole)) {
    //This should be procurement role
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

  if (isSubmitting) {
    return (
      <Container className="flex items-center justify-center h-screen">
        Submitting...
      </Container>
    );
  }

  return (
    <div className="my-8">
      <Container>
        <h1 className="text-3xl font-bold mb-6">Add New Job Opening</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title*
              </label>
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type*
              </label>
              <select
                name="type"
                value={jobData.type}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department*
              </label>
              <input
                type="text"
                name="department"
                value={jobData.department}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description*
            </label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Responsibilities*
            </label>
            <textarea
              name="responsibilities"
              value={jobData.responsibilities}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Requirements*
              </label>
              <button
                type="button"
                onClick={addRequirement}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Requirement
              </button>
            </div>

            {jobData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) =>
                    handleRequirementChange(index, e.target.value)
                  }
                  required
                  className="flex-1 p-2 border rounded"
                  placeholder={`Requirement ${index + 1}`}
                />
                {jobData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/careers")}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Job Posting"}
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}
