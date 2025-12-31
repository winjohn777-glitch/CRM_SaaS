'use client';

import { useCRMConfig } from '@crm/ui';
import {
  Users,
  Building2,
  Target,
  Calendar,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for the dashboard
const stats = [
  {
    name: 'Total Contacts',
    value: '2,847',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    href: '/crm/contacts',
  },
  {
    name: 'Active Accounts',
    value: '284',
    change: '+5%',
    changeType: 'positive',
    icon: Building2,
    href: '/crm/accounts',
  },
  {
    name: 'Open Opportunities',
    value: '47',
    change: '-3%',
    changeType: 'negative',
    icon: Target,
    href: '/crm/opportunities',
  },
  {
    name: 'Pipeline Value',
    value: '$1.2M',
    change: '+18%',
    changeType: 'positive',
    icon: DollarSign,
    href: '/crm/opportunities',
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'call',
    description: 'Call scheduled with ABC Roofing',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'opportunity',
    description: 'New opportunity: Smith Residence Roof Replacement',
    time: '4 hours ago',
  },
  {
    id: 3,
    type: 'contact',
    description: 'Added new contact: Jane Smith',
    time: '1 day ago',
  },
  {
    id: 4,
    type: 'won',
    description: 'Won deal: Johnson Commercial Roofing',
    time: '2 days ago',
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Site Visit - 123 Main St',
    dueDate: 'Today, 2:00 PM',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Send estimate to Johnson',
    dueDate: 'Tomorrow, 10:00 AM',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Follow up with ABC Corp',
    dueDate: 'Dec 15, 2024',
    priority: 'low',
  },
];

export default function CRMDashboard() {
  const { currentTemplate, configuration } = useCRMConfig();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, John!
        </h1>
        <p className="text-gray-600">
          Your {currentTemplate?.replace('_', ' ').toLowerCase()} CRM is configured with{' '}
          {configuration?.modules.filter((m) => m.isEnabled).length || 0} active modules.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`inline-flex items-center text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.changeType === 'positive' ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/crm/activities"
              className="text-sm text-blue-600 hover:underline"
            >
              View all activities
            </Link>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Upcoming Tasks</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{task.dueDate}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/crm/activities"
              className="text-sm text-blue-600 hover:underline"
            >
              View all tasks
            </Link>
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Pipeline Overview</h2>
          <Link
            href="/crm/opportunities"
            className="text-sm text-blue-600 hover:underline"
          >
            View Pipeline Board
          </Link>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            {configuration?.pipelines[0]?.stages.slice(0, 6).map((stage, idx) => (
              <div key={idx} className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    {stage.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {Math.floor(Math.random() * 10 + 1)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: stage.color || '#3B82F6',
                      width: `${Math.floor(Math.random() * 80 + 20)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
