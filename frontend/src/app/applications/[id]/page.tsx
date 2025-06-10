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
  FiExternalLink,
  FiEdit3,
  FiSave,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface Application {
  id: number;
  job_advertisement: number;
  position: string;
  job_department?: string;
  job_type?: string;
  job_location?: string;
  applicant_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  experience: string;
  skills: string[];
  status: string;
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
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(
          `${apiUrl}careers/api/job-applications/${id}/`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch application");
        }

        const data = await response.json();
        setApplication(data);
        console.log("Application data", data);
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
        ...prev!,
        ...updatedApp,
        status: newStatus,
      }));

      toast("Application status updated successfully");
    } catch (err) {
      console.error("Error updating application status:", err);
      toast("Failed to update application status");
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleSaveNotes = async () => {
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
            status: application.status,
            notes: notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update notes");
      }

      const updatedApp = await response.json();
      setApplication((prev) => ({
        ...prev!,
        ...updatedApp,
        notes: notes,
      }));

      setIsEditingNotes(false);
      alert("Notes updated successfully");
    } catch (err) {
      console.error("Error updating notes:", err);
      alert("Failed to update notes");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusButtonStyle = (status: string, currentStatus: string) => {
    const isActive = currentStatus === status;
    const baseStyle =
      "px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200";

    if (isActive) {
      return `${baseStyle} bg-[#0E0E96] text-white border-[#0E0E96]`;
    }

    switch (status) {
      case "pending":
        return `${baseStyle} bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50`;
      case "approved":
        return `${baseStyle} bg-white text-green-700 border-green-300 hover:bg-green-50`;
      case "rejected":
        return `${baseStyle} bg-white text-red-700 border-red-300 hover:bg-red-50`;
      default:
        return `${baseStyle} bg-white text-gray-700 border-gray-300 hover:bg-gray-50`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="h-24 bg-gray-200 animate-pulse"></div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#0E0E96] hover:text-blue-800 mb-8 font-medium transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Applications
          </button>
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center">
                <FiX className="mr-3 text-red-500" />
                {error || "Application not found"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#0E0E96] hover:text-blue-800 mb-8 font-medium transition-colors group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Applications
        </button>

        <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#0E0E96] px-8 py-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {application.position}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-blue-100">
                  <div className="flex items-center">
                    <FiUser className="mr-2 w-4 h-4" />
                    {application.applicant_name}
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-2 w-4 h-4" />
                    Applied{" "}
                    {new Date(application.applied_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    application.status
                  )}`}
                >
                  {application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiUser className="mr-2 text-[#0E0E96]" />
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiMail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{application.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{application.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiFileText className="mr-2 text-[#0E0E96]" />
                    Documents
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Cover Letter</span>
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          application.cover_letter
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {application.cover_letter ? "Provided" : "Not provided"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Resume</span>
                      {application.resume_url ? (
                        <a
                          href={application.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-[#0E0E96] hover:text-blue-800 text-sm font-medium"
                        >
                          Download <FiExternalLink className="ml-1 w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm px-2 py-1 rounded bg-gray-100 text-gray-500">
                          Not uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiBriefcase className="mr-2 text-[#0E0E96]" />
                    Skills
                  </h2>
                  {application.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-[#0E0E96] border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Experience */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiBriefcase className="mr-2 text-[#0E0E96]" />
                    Experience
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {application.experience ||
                        "No experience details provided"}
                    </p>
                  </div>
                </div>

                {/* Cover Letter */}
                {application.cover_letter && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiFileText className="mr-2 text-[#0E0E96]" />
                      Cover Letter
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {application.cover_letter}
                      </p>
                    </div>
                  </div>
                )}

                {/* <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiClock className="mr-2 text-[#0E0E96]" />
                    Application Status
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleStatusChange("pending")}
                      className={getStatusButtonStyle(
                        "pending",
                        application.status
                      )}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange("approved")}
                      className={getStatusButtonStyle(
                        "approved",
                        application.status
                      )}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange("rejected")}
                      className={getStatusButtonStyle(
                        "rejected",
                        application.status
                      )}
                    >
                      Reject
                    </button>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Notes Section - Full Width
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiEdit3 className="mr-2 text-[#0E0E96]" />
                  Notes
                </h2>
                {!isEditingNotes && (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="text-[#0E0E96] hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <FiEdit3 className="mr-1 w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E0E96] focus:border-[#0E0E96] resize-none"
                    rows={4}
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Add your notes about this application..."
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveNotes}
                      className="flex items-center px-4 py-2 bg-[#0E0E96] text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      <FiSave className="mr-2 w-4 h-4" />
                      Save Notes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingNotes(false);
                        setNotes(application.notes || "");
                      }}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FiX className="mr-2 w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                  {notes || application.notes ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {notes || application.notes}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No notes added yet. Click edit to add notes about this
                      application.
                    </p>
                  )}
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
