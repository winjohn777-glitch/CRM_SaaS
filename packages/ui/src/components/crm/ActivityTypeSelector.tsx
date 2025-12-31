'use client';

import React from 'react';
import { useCRMConfig } from '../../contexts/CRMConfigContext';
import { cn } from '../../utils/cn';
import type { ActivityTypeConfiguration, ActivityCategory } from '@crm/types';
import {
  Phone,
  Mail,
  Calendar,
  MapPin,
  ClipboardCheck,
  FileText,
  Presentation,
  MessageSquare,
  CheckCircle,
  StickyNote,
  File,
  MoreHorizontal,
} from 'lucide-react';

const categoryIcons: Record<ActivityCategory, React.ComponentType<{ className?: string }>> = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Calendar,
  SITE_VISIT: MapPin,
  INSPECTION: ClipboardCheck,
  ESTIMATE: FileText,
  PRESENTATION: Presentation,
  FOLLOW_UP: MessageSquare,
  TASK: CheckCircle,
  NOTE: StickyNote,
  DOCUMENT: File,
  CUSTOM: MoreHorizontal,
};

const categoryColors: Record<ActivityCategory, string> = {
  CALL: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  EMAIL: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  MEETING: 'bg-green-100 text-green-700 hover:bg-green-200',
  SITE_VISIT: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  INSPECTION: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  ESTIMATE: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
  PRESENTATION: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  FOLLOW_UP: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
  TASK: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  NOTE: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  DOCUMENT: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  CUSTOM: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
};

export interface ActivityTypeSelectorProps {
  value?: string;
  onChange: (activityTypeKey: string) => void;
  disabled?: boolean;
  className?: string;
  layout?: 'grid' | 'list';
}

export function ActivityTypeSelector({
  value,
  onChange,
  disabled,
  className,
  layout = 'grid',
}: ActivityTypeSelectorProps) {
  const { activityTypes } = useCRMConfig();

  // Group activity types by category
  const groupedTypes = activityTypes.reduce<Record<string, ActivityTypeConfiguration[]>>(
    (acc, type) => {
      const category = type.category || 'CUSTOM';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(type);
      return acc;
    },
    {}
  );

  if (layout === 'list') {
    return (
      <div className={cn('space-y-1', className)}>
        {activityTypes.map((type) => {
          const Icon = categoryIcons[type.category] || MoreHorizontal;
          const isSelected = value === type.activityKey;

          return (
            <button
              key={type.activityKey}
              type="button"
              onClick={() => onChange(type.activityKey)}
              disabled={disabled}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors',
                isSelected
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                  : 'hover:bg-gray-50'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{type.name}</div>
                {type.description && (
                  <div className="text-xs text-gray-500 truncate">
                    {type.description}
                  </div>
                )}
              </div>
              {type.durationDefault && (
                <span className="text-xs text-gray-400">
                  {type.durationDefault} min
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {Object.entries(groupedTypes).map(([category, types]) => (
        <div key={category}>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            {category.replace('_', ' ')}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {types.map((type) => {
              const Icon = categoryIcons[type.category] || MoreHorizontal;
              const isSelected = value === type.activityKey;
              const colorClass = categoryColors[type.category] || categoryColors.CUSTOM;

              return (
                <button
                  key={type.activityKey}
                  type="button"
                  onClick={() => onChange(type.activityKey)}
                  disabled={disabled}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg transition-all',
                    isSelected
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : '',
                    colorClass,
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center">
                    {type.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivityTypeIcon({
  category,
  className,
}: {
  category: ActivityCategory;
  className?: string;
}) {
  const Icon = categoryIcons[category] || MoreHorizontal;
  return <Icon className={className} />;
}

export function getActivityTypeColor(category: ActivityCategory): string {
  return categoryColors[category] || categoryColors.CUSTOM;
}
