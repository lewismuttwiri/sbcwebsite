"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiDownload,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiFileText,
  FiUser,
  FiCalendar,
} from "react-icons/fi";

interface Application {
  id: number;
  job_advertisement: number;
  job_title: string;
  job_department: string;
  job_type: string;
  job_location: string;
  applicant_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  experience: string;
  skills: string[];
  status?: string;
  status_display: string;
  applied_date: string;
  resume_url: string | null;
  notes: string;
}

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(
          `${apiUrl}careers/api/job-applications/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch application");
        }

        const data = await response.json();
        setApplication(data);
        setNotes(data.notes || "");
      } catch (err) {
        setError("Failed to load application details");
        console.error("Error fetching application:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!application) return;

    try {
      const response = await fetch(
        `${apiUrl}careers/api/job-applications/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: newStatus,
            notes: notes || application.notes || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      const updatedApp = await response.json();
      setApplication((prev) => ({
        ...prev,
        ...updatedApp,
        status: newStatus,
        status_display: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
      }));

      alert("Application status updated successfully");
    } catch (err) {
      console.error("Error updating application status:", err);
      alert("Failed to update application status");
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <FiArrowLeft className="mr-2" /> Back to Applications
          </button>
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <FiArrowLeft className="mr-2" /> Back to Applications
          </button>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-red-500 p-4 bg-red-50 rounded-md">
              {error || "Application not found"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Applications
        </button>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {application.job_title}
                </h1>
                <p className="text-sm text-gray-500">
                  {application.job_department} • {application.job_location}
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    application.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : application.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {application.status_display}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Applicant Information */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FiUser className="mr-2" /> Applicant Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FiMail className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-700">
                        {application.email}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-700">
                        {application.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FiClock className="mr-2" /> Application Timeline
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FiCalendar className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-700">
                        Applied on{" "}
                        {new Date(
                          application.applied_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FiFileText className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-700">
                        {application.cover_letter
                          ? "Cover letter provided"
                          : "No cover letter"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FiDownload className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-700">
                        {application.resume_url
                          ? "Resume uploaded"
                          : "No resume uploaded"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FiBriefcase className="mr-2" /> Job Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FiMapPin className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-700">
                        Location: {application.job_location}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FiBriefcase className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-700">
                        Department: {application.job_department}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-700">
                        Type: {application.job_type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FiFileText className="mr-2" /> Experience & Skills
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Experience:
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {application.experience ||
                          "No experience details provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Skills:
                      </p>
                      {application.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {application.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No skills listed
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Actions */}
              <div className="lg:col-span-1 space-y-6">
                {/* <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FiFileText className="mr-2" /> Notes
                  </h2>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Add your notes here..."
                  />
                </div> */}

                {/* <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FiArrowLeft className="mr-2" /> Status
                  </h2>
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => handleStatusChange('pending')}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        application.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        application.status === 'approved'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange('rejected')}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        application.status === 'rejected'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Reject
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
