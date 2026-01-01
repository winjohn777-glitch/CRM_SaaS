'use client';

import { useState } from 'react';
import { Button, Modal, Input, Select, Badge } from '@crm/ui';
import type { CRMActivity, ActivityStatus } from '@crm/types';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns';

// Mock activities data
const mockActivities: CRMActivity[] = [
  {
    id: '1',
    tenantId: '1',
    activityTypeKey: 'site_visit',
    subject: 'Roof Inspection - Sunrise Property',
    description: 'Annual inspection of commercial roof',
    scheduledAt: new Date(),
    status: 'SCHEDULED',
    contactId: '1',
    accountId: '1',
    opportunityId: '1',
    assignedToId: 'user1',
    durationMinutes: 60,
    location: { address: '123 Main St, Miami, FL' },
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    tenantId: '1',
    activityTypeKey: 'phone_call',
    subject: 'Follow-up call with Sarah Johnson',
    description: 'Discuss estimate for new roof',
    scheduledAt: addDays(new Date(), 1),
    status: 'SCHEDULED',
    contactId: '2',
    assignedToId: 'user1',
    durationMinutes: 30,
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    tenantId: '1',
    activityTypeKey: 'meeting',
    subject: 'Contract Review - Metro Development',
    description: 'Review contract terms for Phase 2',
    scheduledAt: addDays(new Date(), 2),
    status: 'SCHEDULED',
    accountId: '4',
    opportunityId: '2',
    assignedToId: 'user1',
    durationMinutes: 90,
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    tenantId: '1',
    activityTypeKey: 'email',
    subject: 'Send proposal to Commercial Plaza',
    description: 'Email detailed proposal for roof replacement',
    scheduledAt: addDays(new Date(), -1),
    completedAt: addDays(new Date(), -1),
    status: 'COMPLETED',
    accountId: '2',
    opportunityId: '3',
    assignedToId: 'user1',
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    tenantId: '1',
    activityTypeKey: 'task',
    subject: 'Prepare material order for Oakwood project',
    description: 'Order shingles and underlayment',
    scheduledAt: addDays(new Date(), -2),
    status: 'SCHEDULED',
    accountId: '3',
    assignedToId: 'user1',
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const activityTypes = [
  { key: 'phone_call', label: 'Phone Call', icon: Phone, color: 'blue' },
  { key: 'email', label: 'Email', icon: Mail, color: 'green' },
  { key: 'meeting', label: 'Meeting', icon: Calendar, color: 'purple' },
  { key: 'site_visit', label: 'Site Visit', icon: MapPin, color: 'orange' },
  { key: 'task', label: 'Task', icon: ClipboardCheck, color: 'gray' },
];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<CRMActivity[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<CRMActivity | null>(null);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      searchQuery === '' ||
      activity.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || activity.status === statusFilter;

    const matchesType =
      typeFilter === 'all' || activity.activityTypeKey === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.scheduledAt ? format(activity.scheduledAt, 'yyyy-MM-dd') : 'unscheduled';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, CRMActivity[]>);

  const sortedDates = Object.keys(groupedActivities).sort();

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...activityTypes.map((t) => ({ value: t.key, label: t.label })),
  ];

  const getActivityIcon = (typeKey: string) => {
    const type = activityTypes.find((t) => t.key === typeKey);
    return type?.icon || ClipboardCheck;
  };

  const getActivityColor = (typeKey: string) => {
    const type = activityTypes.find((t) => t.key === typeKey);
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      gray: 'bg-gray-100 text-gray-600',
    };
    return colors[type?.color || 'gray'];
  };

  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDateLabel = (dateStr: string) => {
    if (dateStr === 'unscheduled') return 'Unscheduled';
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return `Overdue - ${format(date, 'MMM d, yyyy')}`;
    return format(date, 'EEEE, MMM d, yyyy');
  };

  const markComplete = (activityId: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, status: 'COMPLETED' as ActivityStatus, completedAt: new Date() }
          : a
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-sm text-gray-500">
            {filteredActivities.length} activit{filteredActivities.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Log Activity
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex-1">
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={typeOptions}
          className="w-36"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          className="w-36"
        />
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
          More
        </Button>
      </div>

      {/* Activities List */}
      <div className="space-y-6">
        {sortedDates.map((dateStr) => {
          const dateActivities = groupedActivities[dateStr];
          const isOverdue = dateStr !== 'unscheduled' && isPast(new Date(dateStr)) && !isToday(new Date(dateStr));

          return (
            <div key={dateStr}>
              <h3 className={`text-sm font-semibold mb-3 ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                {getDateLabel(dateStr)}
              </h3>
              <div className="space-y-2">
                {dateActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.activityTypeKey);
                  return (
                    <div
                      key={activity.id}
                      className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer ${
                        activity.status === 'COMPLETED' ? 'border-gray-100 bg-gray-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.activityTypeKey)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${activity.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {activity.subject}
                            </h4>
                            {getStatusIcon(activity.status)}
                          </div>
                          {activity.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                              {activity.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {activity.scheduledAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(activity.scheduledAt, 'h:mm a')}
                              </span>
                            )}
                            {activity.durationMinutes && (
                              <span>{activity.durationMinutes} min</span>
                            )}
                            {activity.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {typeof activity.location === 'object' && 'address' in activity.location
                                  ? activity.location.address
                                  : 'Location set'}
                              </span>
                            )}
                          </div>
                        </div>
                        {activity.status !== 'COMPLETED' && activity.status !== 'CANCELLED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markComplete(activity.id);
                            }}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No activities found</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Log your first activity
          </Button>
        </div>
      )}

      {/* Create Activity Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Log Activity"
        size="lg"
      >
        <form className="space-y-4">
          <Select
            label="Activity Type"
            options={activityTypes.map((t) => ({ value: t.key, label: t.label }))}
          />
          <Input label="Subject" required placeholder="Follow-up call with..." />
          <Input
            label="Description"
            placeholder="Notes about this activity..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (minutes)" type="number" placeholder="30" />
            <Input label="Location" placeholder="123 Main St" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Log Activity</Button>
          </div>
        </form>
      </Modal>

      {/* Activity Detail Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.subject || ''}
        size="lg"
      >
        {selectedActivity && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = getActivityIcon(selectedActivity.activityTypeKey);
                return (
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(selectedActivity.activityTypeKey)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                );
              })()}
              <div>
                <p className="font-medium capitalize">
                  {selectedActivity.activityTypeKey.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedActivity.status}
                </p>
              </div>
            </div>
            {selectedActivity.description && (
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedActivity.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Scheduled</p>
                <p className="font-medium">
                  {selectedActivity.scheduledAt
                    ? format(selectedActivity.scheduledAt, 'PPP p')
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">
                  {selectedActivity.durationMinutes
                    ? `${selectedActivity.durationMinutes} minutes`
                    : '-'}
                </p>
              </div>
              {selectedActivity.completedAt && (
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="font-medium">
                    {format(selectedActivity.completedAt, 'PPP p')}
                  </p>
                </div>
              )}
              {selectedActivity.location && (
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {typeof selectedActivity.location === 'object' && 'address' in selectedActivity.location
                      ? selectedActivity.location.address
                      : 'Location set'}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedActivity(null)}>
                Close
              </Button>
              {selectedActivity.status !== 'COMPLETED' && (
                <Button
                  onClick={() => {
                    markComplete(selectedActivity.id);
                    setSelectedActivity(null);
                  }}
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
