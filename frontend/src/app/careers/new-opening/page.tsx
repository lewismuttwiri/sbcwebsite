"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JobPosting } from "@/types/job";
import Container from "@/components/layout/Container";
import toast from "react-hot-toast";

export default function NewJobOpening() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setCsrfToken(parsedUser.entity.token);
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

      // router.push("/careers");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

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
