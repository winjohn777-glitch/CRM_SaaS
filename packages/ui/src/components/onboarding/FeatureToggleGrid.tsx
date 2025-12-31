'use client';

import React from 'react';
import { Card } from '../core/Card';
import { cn } from '../../utils/cn';
import {
  Users,
  Building2,
  Target,
  Calendar,
  FileText,
  BarChart3,
  Mail,
  CalendarDays,
  UsersRound,
  Key,
  Zap,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';

interface FeatureDefinition {
  key: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: 'core' | 'advanced' | 'integrations';
  defaultEnabled: boolean;
}

const features: FeatureDefinition[] = [
  // Core Features
  {
    key: 'contacts',
    name: 'Contacts',
    description: 'People/leads database',
    icon: Users,
    category: 'core',
    defaultEnabled: true,
  },
  {
    key: 'accounts',
    name: 'Accounts',
    description: 'Companies/organizations',
    icon: Building2,
    category: 'core',
    defaultEnabled: true,
  },
  {
    key: 'opportunities',
    name: 'Opportunities',
    description: 'Deals/sales pipeline',
    icon: Target,
    category: 'core',
    defaultEnabled: true,
  },
  {
    key: 'activities',
    name: 'Activities',
    description: 'Tasks, calls, meetings',
    icon: Calendar,
    category: 'core',
    defaultEnabled: true,
  },
  {
    key: 'documents',
    name: 'Documents',
    description: 'File storage, templates',
    icon: FileText,
    category: 'core',
    defaultEnabled: true,
  },
  {
    key: 'reports',
    name: 'Reports',
    description: 'Dashboards, analytics',
    icon: BarChart3,
    category: 'core',
    defaultEnabled: true,
  },
  // Advanced Features
  {
    key: 'email_integration',
    name: 'Email Integration',
    description: 'Send/receive emails',
    icon: Mail,
    category: 'advanced',
    defaultEnabled: false,
  },
  {
    key: 'calendar',
    name: 'Calendar',
    description: 'Scheduling, reminders',
    icon: CalendarDays,
    category: 'advanced',
    defaultEnabled: true,
  },
  {
    key: 'team_users',
    name: 'Team/Users',
    description: 'Multi-user, roles, permissions',
    icon: UsersRound,
    category: 'advanced',
    defaultEnabled: true,
  },
  {
    key: 'api_access',
    name: 'API Access',
    description: 'External integrations',
    icon: Key,
    category: 'advanced',
    defaultEnabled: false,
  },
  {
    key: 'automations',
    name: 'Automations',
    description: 'Workflow triggers',
    icon: Zap,
    category: 'advanced',
    defaultEnabled: false,
  },
  {
    key: 'mobile_app',
    name: 'Mobile App',
    description: 'iOS/Android access',
    icon: Smartphone,
    category: 'advanced',
    defaultEnabled: false,
  },
];

export interface FeatureToggleGridProps {
  enabledFeatures: Record<string, boolean>;
  onChange: (featureKey: string, enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function FeatureToggleGrid({
  enabledFeatures,
  onChange,
  disabled,
  className,
}: FeatureToggleGridProps) {
  const coreFeatures = features.filter((f) => f.category === 'core');
  const advancedFeatures = features.filter((f) => f.category === 'advanced');

  const renderFeatureCard = (feature: FeatureDefinition) => {
    const isEnabled = enabledFeatures[feature.key] ?? feature.defaultEnabled;
    const Icon = feature.icon;

    return (
      <button
        key={feature.key}
        type="button"
        onClick={() => onChange(feature.key, !isEnabled)}
        disabled={disabled}
        className={cn(
          'relative p-4 rounded-lg border-2 transition-all text-left',
          isEnabled
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* Toggle indicator */}
        <div
          className={cn(
            'absolute top-3 right-3 w-10 h-6 rounded-full transition-colors',
            isEnabled ? 'bg-blue-500' : 'bg-gray-200'
          )}
        >
          <div
            className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
              isEnabled ? 'translate-x-5' : 'translate-x-1'
            )}
          />
        </div>

        <Icon
          className={cn(
            'h-6 w-6 mb-2',
            isEnabled ? 'text-blue-600' : 'text-gray-400'
          )}
        />

        <h4
          className={cn(
            'font-medium text-sm mb-0.5',
            isEnabled ? 'text-blue-900' : 'text-gray-900'
          )}
        >
          {feature.name}
        </h4>

        <p className="text-xs text-gray-500">{feature.description}</p>
      </button>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Customize Your Features
        </h2>
        <p className="text-sm text-gray-500">
          Toggle features on/off based on your needs
        </p>
      </div>

      {/* Core Features */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
            1
          </span>
          Core Features
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {coreFeatures.map(renderFeatureCard)}
        </div>
      </div>

      {/* Advanced Features */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
            2
          </span>
          Advanced Features
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {advancedFeatures.map(renderFeatureCard)}
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {Object.values(enabledFeatures).filter(Boolean).length} features enabled
          </p>
          <p className="text-xs text-gray-500">
            You can change these settings anytime
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            // Reset to defaults
            features.forEach((f) => {
              onChange(f.key, f.defaultEnabled);
            });
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
