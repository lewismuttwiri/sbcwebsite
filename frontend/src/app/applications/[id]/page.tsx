'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Application } from '../types';

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        // In a real app, fetch the specific application by ID
        const response = await fetch(`/api/applications/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            // Include auth token in a real application
            // 'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch application');
        }

        const data = await response.json();
        setApplication(data);
        setNotes(data.notes || '');
      } catch (err) {
        setError('Failed to load application details');
        console.error('Error fetching application:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Include auth token in a real application
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes: notes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      // Refresh the application data
      const updatedApp = await response.json();
      setApplication(updatedApp);
      setNotes(updatedApp.notes || '');
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status');
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Applications
          </button>
          <p>Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Applications
          </button>
          <p className="text-red-500">{error || 'Application not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Applications
        </button>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {application.applicantName}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Applied for {application.position}
              </p>
            </div>
            <div className="flex space-x-2">
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View Resume
              </a>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a href={`mailto:${application.email}`} className="text-blue-600 hover:underline">
                        {application.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a href={`tel:${application.phone}`} className="text-blue-600 hover:underline">
                        {application.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${application.status === 'hired' ? 'bg-green-100 text-green-800' : 
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Applied On</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Experience</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.experience}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {application.skills && application.skills.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {application.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {application.coverLetter && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Cover Letter</h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-line text-gray-700">{application.coverLetter}</p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">HR Notes</h3>
              <div className="mt-2">
                <textarea
                  rows={4}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Add private notes about this applicant..."
                  value={notes}
                  onChange={handleNotesChange}
                />
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => handleStatusChange('rejected')}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('interviewed')}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Mark as Interviewed
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('hired')}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Hire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
