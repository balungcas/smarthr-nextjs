'use client';

import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Building } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Department {
  id: string;
  name: string;
  description: string | null;
  designation_count: number;
}

async function fetchDepartments(): Promise<Department[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('departments')
    .select('*, designations(count)')
    .order('name', { ascending: true });

  if (error) {
    throw new Error('Failed to fetch departments');
  }

  return (data || []).map((dept: any) => ({
    ...dept,
    designation_count: dept.designations?.[0]?.count || 0,
  }));
}

export default function DepartmentsPage() {
  const { data: departments, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600 mt-2">Manage your organization's departments</p>
          </div>

          {/* Content */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading departments...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Error: {error instanceof Error ? error.message : 'Failed to load departments'}
              </p>
            </div>
          )}

          {departments && departments.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No departments found</p>
            </div>
          )}

          {departments && departments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((department) => (
                <div
                  key={department.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {department.name}
                      </h3>
                      {department.description && (
                        <p className="text-sm text-gray-600 mb-3">{department.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          {department.designation_count} designation
                          {department.designation_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {departments && departments.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Total Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Designations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departments.reduce((sum, dept) => sum + dept.designation_count, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Designations/Dept</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(
                      departments.reduce((sum, dept) => sum + dept.designation_count, 0) /
                      departments.length
                    ).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
