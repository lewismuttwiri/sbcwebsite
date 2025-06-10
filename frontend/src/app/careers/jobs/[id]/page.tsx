"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getJobById } from "@/utils/careers";

// Mock data - replace with actual data fetching
// const getJobDetails = async (id: string) => {
//   // In a real app, you would fetch this from your API
//   const jobs = [
//     {
//       id: "1",
//       title: "Software Engineer",
//       location: "Nairobi, Kenya",
//       type: "Full-time",
//       description:
//         "We are looking for a skilled software engineer to join our team...",
//       requirements: [
//         "3+ years of experience with React and Next.js",
//         "Strong TypeScript skills",
//         "Experience with modern frontend tooling",
//       ],
//     },
//     // Add more mock jobs as needed
//   ];

//   return jobs.find((job) => job.id === id);
// };

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const job = await getJobById((await params).id);

  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/careers/jobs"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to all jobs
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <span className="mr-4">{job.location}</span>
            <span>{job.type}</span>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="mb-6">{job.description}</p>

            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="list-disc pl-6 mb-8">
              {job.requirements.map((req: any, index: any) => (
                <li key={index} className="mb-2">
                  {req}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href={`/careers/jobs/apply?jobId=${
                  job.id
                }&jobTitle=${encodeURIComponent(job.title)}`}
              >
                <Button className="bg-blue-600 hover:bg-blue-700">
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
