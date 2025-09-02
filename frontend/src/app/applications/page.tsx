"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  FileText,
  Award,
  ChevronDown,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
// import Link from "next/link";
// import router from "next/router";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

// Your existing Application type
interface Application {
  id: number;
  applicant_name: string;
  applied_date: string;
  cover_letter: string;
  email: string;
  experience: string;
  job_advertisement: number;
  notes: string;
  phone: string;
  position: string;
  resume_url: string;
  skills: string[];
  status: string;
}

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user_role, setUserRole] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.entity.user_role);
    }
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      try {
        const response = await fetch(`api/applications/`, {
          method: "GET",
          credentials: "include",
        });

        console.log("response", response);

        if (!response.ok) {
          console.log("Failed to fetch applications");
          return [];
        }

        const data = await response.json();
        setApplications(data);
        console.log("All Applications data", data);
        return;
      } catch (err) {
        setError("Failed to load applications");
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get status color and icon
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "bg-amber-100", text: "text-amber-800", icon: Clock };
      case "reviewed":
        return { bg: "bg-blue-100", text: "text-blue-800", icon: Eye };
      case "interviewed":
        return { bg: "bg-purple-100", text: "text-purple-800", icon: Users };
      case "hired":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: CheckCircle,
        };
      default:
        return { bg: "bg-red-100", text: "text-red-800", icon: XCircle };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Your existing permission check
  if (![5, 1].includes(user_role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 text-lg">
              You do not have permission to view job applications
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 text-lg mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Job Applications
              </h1>
              <p className="text-gray-600">
                Manage and review candidate applications
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <span className="text-2xl font-bold text-blue-600">
                  {applications.length}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  Total Applications
                </span>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, position, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === "table"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Content */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No job applications have been submitted yet"}
            </p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((application) => {
                  const statusStyle = getStatusStyle(application.status);
                  const StatusIcon = statusStyle.icon;

                  return (
                    <div
                      key={application.id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[#0E0E96] rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {application.applicant_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {application.applicant_name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {application.position}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full flex items-center space-x-1 ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span className="text-xs font-semibold capitalize">
                            {application.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{application.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{application.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(application.applied_date)}</span>
                        </div>
                      </div>

                      {application.skills && application.skills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {application.skills
                              .slice(0, 3)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            {application.skills.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{application.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <Button
                          onClick={() =>
                            router.push(`/applications/${application.id}`)
                          }
                          className="bg-[#0E0E96] text-gray-100 py-2 px-4 rounded-lg font-semibold transition-colors space-x-2"
                        >
                          <div className="flex items-center space-x-2">
                            <div>
                              <Eye className="w-4 h-4" />
                            </div>
                            <p>View Details</p>
                          </div>
                        </Button>
                        {application.resume_url && (
                          <a
                            href={application.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-900">
                    Applications Overview
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applicant
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th> */}
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map((application) => {
                        const statusStyle = getStatusStyle(application.status);
                        const StatusIcon = statusStyle.icon;

                        return (
                          <tr
                            key={application.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {application.applicant_name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {application.applicant_name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {application.position}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {application.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.phone}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(application.applied_date)}
                              </div>
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className={`px-3 py-1 rounded-full flex items-center space-x-1 w-fit ${statusStyle.bg} ${statusStyle.text}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                <span className="text-xs font-semibold capitalize">
                                  {application.status}
                                </span>
                              </div>
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <a
                                  href={`/applications/${application.id}`}
                                  className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>View</span>
                                </a>
                                {application.resume_url && (
                                  <a
                                    href={application.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                                  >
                                    <Download className="w-4 h-4" />
                                    <span>Resume</span>
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
