'use client';

import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Calendar, Clock, User } from 'lucide-react';

interface Leave {
  id: string;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: string;
  created_at: string;
}

async function fetchLeaves(): Promise<Leave[]> {
  const response = await fetch('/.netlify/functions/leaves');
  if (!response.ok) {
    throw new Error('Failed to fetch leaves');
  }
  return response.json();
}

export default function LeavesPage() {
  const { data: leaves, isLoading, error } = useQuery({
    queryKey: ['leaves'],
    queryFn: fetchLeaves,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
            <p className="text-gray-600 mt-2">Manage employee leave requests and approvals</p>
          </div>

          {/* Content */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading leaves...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Error: {error instanceof Error ? error.message : 'Failed to load leaves'}
              </p>
            </div>
          )}

          {leaves && leaves.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No leave requests found</p>
            </div>
          )}

          {leaves && leaves.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4">
                {leaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Employee Info */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{leave.employee_name}</h3>
                            <p className="text-sm text-gray-500">{leave.leave_type}</p>
                          </div>
                        </div>

                        {/* Leave Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>
                              {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>
                              {leave.days} {leave.days === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Requested: {formatDate(leave.created_at)}
                          </div>
                        </div>

                        {/* Reason */}
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{leave.reason}</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="ml-4">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            leave.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : leave.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{leaves.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {leaves.filter((l) => l.status === 'pending').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {leaves.filter((l) => l.status === 'approved').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">
                      {leaves.filter((l) => l.status === 'rejected').length}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
