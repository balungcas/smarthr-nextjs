'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Users,
  Building2,
  Calendar,
  FileText,
  DollarSign,
  Target,
  Briefcase,
  TrendingUp,
  UserPlus,
  CalendarClock,
  Package,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Employees', value: '156', icon: Users, color: 'bg-blue-500' },
    { label: 'Departments', value: '12', icon: Building2, color: 'bg-purple-500' },
    { label: 'Projects', value: '28', icon: Briefcase, color: 'bg-green-500' },
    { label: 'Pending Leaves', value: '8', icon: Calendar, color: 'bg-yellow-500' },
  ];

  const quickActions = [
    { label: 'Add Employee', href: '/employees/new', icon: UserPlus, color: 'bg-blue-500' },
    { label: 'Create Invoice', href: '/invoices/new', icon: FileText, color: 'bg-green-500' },
    { label: 'Process Payroll', href: '/payroll', icon: DollarSign, color: 'bg-purple-500' },
    { label: 'View Timesheets', href: '/timesheets', icon: CalendarClock, color: 'bg-orange-500' },
  ];

  const modules = [
    { label: 'Employees', href: '/employees', icon: Users, description: 'Manage employee records' },
    { label: 'Departments', href: '/departments', icon: Building2, description: 'Organization structure' },
    { label: 'Leaves', href: '/leaves', icon: Calendar, description: 'Leave management' },
    { label: 'Projects', href: '/projects', icon: Briefcase, description: 'Project tracking' },
    { label: 'Invoices', href: '/invoices', icon: FileText, description: 'Client invoicing' },
    { label: 'Payroll', href: '/payroll', icon: DollarSign, description: 'Salary processing' },
    { label: 'Goals', href: '/goals', icon: Target, description: 'Performance goals' },
    { label: 'Assets', href: '/assets', icon: Package, description: 'Asset management' },
    { label: 'Reports', href: '/reports', icon: TrendingUp, description: 'Analytics & reports' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Welcome back, {user?.first_name || 'User'}!
              </h1>
              <button
                onClick={() => {
                  const { signOut } = useAuth();
                  signOut();
                }}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Sign Out
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Role: <span className="font-semibold capitalize">{user?.role || 'Employee'}</span>
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                  <div className={`${action.color} rounded-lg p-3 mr-3`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Modules Grid */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">All Modules</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <Link
                  key={module.label}
                  href={module.href}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-lg p-3">
                      <module.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{module.label}</h3>
                      <p className="mt-1 text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center border-b pb-4">
                <div className="bg-green-100 rounded-full p-2">
                  <UserPlus className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New employee added</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center border-b pb-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Leave request approved</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Invoice generated</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
