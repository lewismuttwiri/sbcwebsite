"use client";

import { useEffect, useState } from "react";
import { Application } from "@/app/applications/types";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/applications", {
          headers: {
            "Content-Type": "application/json",
            // Include auth token in a real application
            // 'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError("Failed to load applications");
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Job Applications</h1>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Job Applications</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Job Applications</h1>

        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">
                        {application.applicantName}
                      </h3>
                      <p className="text-gray-600">{application.position}</p>
                      <p className="text-sm text-gray-500">
                        Applied on:{" "}
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`/applications/${application.id}`}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
