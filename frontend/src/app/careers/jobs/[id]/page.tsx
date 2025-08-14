"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getJobById } from "@/utils/careers";
import { JobPosting } from "@/types/job";

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(params.id);
        if (!jobData) {
          router.push("/404");
          return;
        }
        setJob(jobData);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="mr-4">
            Try Again
          </Button>
          <Link href="/careers/jobs">
            <Button variant="outline">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/careers/jobs"
          className="text-blue-600 hover:underline mb-4 inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to all jobs
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center text-gray-600 mb-6 gap-2">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {job.location}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 18h.01"
                />
              </svg>
              {job.type}
            </span>
          </div>

          <div className="prose max-w-none">
            {job.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Job Description
                </h2>
                <p className="text-gray-700">{job.description}</p>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.responsibilities && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Responsibilities
                </h2>
                <ul className="space-y-2">
                  {job.responsibilities
                    .split("\n")
                    .filter(Boolean)
                    .map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2 mt-1">•</span>
                        <span className="text-gray-700">
                          {responsibility.trim()}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <div className="mt-10">
              <Link
                href={`/careers/jobs/apply?jobId=${
                  job.id
                }&jobTitle=${encodeURIComponent(job.title)}`}
                className="inline-block"
              >
                <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-base">
                  Apply for this position
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
