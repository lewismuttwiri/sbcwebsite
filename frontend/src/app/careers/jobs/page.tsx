"use client";

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { FaBriefcase, FaLocationDot, FaCalendarDays } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { getAllJobs } from "@/utils/careers";

// const jobListings = [
//   {
//     id: 1,
//     title: "Senior Software Engineer",
//     location: "Nairobi, Kenya",
//     type: "Full-time",
//     department: "Engineering",
//     posted: "2025-05-15",
//     description:
//       "We are looking for an experienced Senior Software Engineer to join our growing engineering team. This role involves leading technical initiatives and mentoring junior developers.",
//     requirements: [
//       "5+ years of professional software development experience",
//       "Expertise in TypeScript/JavaScript",
//       "Experience with modern web frameworks",
//       "Strong problem-solving skills",
//       "Excellent communication abilities",
//     ],
//   },
//   {
//     id: 2,
//     title: "Digital Marketing Specialist",
//     location: "Remote",
//     type: "Full-time",
//     department: "Marketing",
//     posted: "2025-05-14",
//     description:
//       "Join our marketing team as a Digital Marketing Specialist. You will be responsible for creating and executing digital marketing campaigns across various channels.",
//     requirements: [
//       "3+ years of digital marketing experience",
//       "Proficiency in SEO and SEM",
//       "Experience with social media management",
//       "Analytical mindset",
//       "Creative content creation skills",
//     ],
//   },
//   {
//     id: 3,
//     title: "Sales Executive",
//     location: "Nairobi, Kenya",
//     type: "Full-time",
//     department: "Sales",
//     posted: "2025-05-13",
//     description:
//       "We are looking for a motivated Sales Executive to join our sales team. This role involves building relationships with potential clients and closing deals.",
//     requirements: [
//       "2+ years of sales experience",
//       "Strong communication skills",
//       "Ability to build client relationships",
//       "Experience in B2B sales",
//       "Target-driven mindset",
//     ],
//   },
// ];

export default function JobsPage() {
  const router = useRouter();
  const [jobListings, setJobListings] = useState<any>([]);

  // useEffect(() => {
  //   getAllJobs().then((data) => setJobListings(data));
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Current Job Openings
          </h1>
          <p className="text-xl text-gray-600">
            Explore our current opportunities and find your perfect fit at SBC
          </p>
        </motion.div>

        {jobListings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-full">
                <FaBriefcase className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-800">
                No Current Openings
              </h3>
              <p className="text-gray-500 max-w-md">
                We don't have any open positions at the moment. Please check
                back later or follow us on our social media for updates on new
                opportunities.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {jobListings.map((job: any) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: job.id * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <FaBriefcase className="text-blue-600 w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {job.title}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <FaLocationDot className="w-4 h-4 mr-1" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {job.type}
                  </span>
                </div>

                <div className="text-gray-600 mb-4">
                  <p className="mb-4">{job.description}</p>
                  <h3 className="font-semibold mb-2">Requirements:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {job.requirements.map((req: any, index: any) => (
                      <li key={index} className="text-gray-600">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    <FaCalendarDays className="w-4 h-4 inline-block mr-1" />
                    Posted {new Date(job.posted).toLocaleDateString()}
                  </span>
                  <Button
                    variant="primary"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/careers/jobs/${job.id}`)
                    }
                  >
                    Apply Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
