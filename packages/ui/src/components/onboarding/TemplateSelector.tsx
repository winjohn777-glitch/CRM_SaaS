'use client';

import React from 'react';
import { Card } from '../core/Card';
import { cn } from '../../utils/cn';
import type { IndustryTemplate } from '@crm/types';
import {
  Briefcase,
  TrendingUp,
  Wrench,
  Package,
  Truck,
  Users,
  Utensils,
  FileText,
  Check,
} from 'lucide-react';

const templateIcons: Record<IndustryTemplate, React.ComponentType<{ className?: string }>> = {
  PROJECT_BASED: Briefcase,
  SALES_FOCUSED: TrendingUp,
  SERVICE_BASED: Wrench,
  INVENTORY_BASED: Package,
  ASSET_BASED: Truck,
  MEMBERSHIP_BASED: Users,
  HOSPITALITY_BASED: Utensils,
  CASE_BASED: FileText,
};

const templateDescriptions: Record<IndustryTemplate, { title: string; description: string; examples: string[] }> = {
  PROJECT_BASED: {
    title: 'Project-Based',
    description: 'Manage jobs, estimates, timelines, and deliverables',
    examples: ['Construction', 'Consulting', 'IT Services'],
  },
  SALES_FOCUSED: {
    title: 'Sales-Focused',
    description: 'Track accounts, territories, and long sales cycles',
    examples: ['Wholesale', 'Finance', 'Real Estate'],
  },
  SERVICE_BASED: {
    title: 'Service-Based',
    description: 'Handle appointments, dispatch, and service history',
    examples: ['Healthcare', 'Repair Services', 'Cleaning'],
  },
  INVENTORY_BASED: {
    title: 'Inventory-Based',
    description: 'Manage products, orders, and fulfillment',
    examples: ['Manufacturing', 'Retail', 'Agriculture'],
  },
  ASSET_BASED: {
    title: 'Asset-Based',
    description: 'Track fleet, equipment, and maintenance',
    examples: ['Trucking', 'Mining', 'Utilities'],
  },
  MEMBERSHIP_BASED: {
    title: 'Membership-Based',
    description: 'Manage members, enrollment, and progress',
    examples: ['Education', 'Gyms', 'Associations'],
  },
  HOSPITALITY_BASED: {
    title: 'Hospitality',
    description: 'Handle reservations, capacity, and guest experience',
    examples: ['Hotels', 'Restaurants', 'Venues'],
  },
  CASE_BASED: {
    title: 'Case-Based',
    description: 'Manage cases, requests, and compliance',
    examples: ['Government', 'Legal', 'Compliance'],
  },
};

const templates: IndustryTemplate[] = [
  'PROJECT_BASED',
  'SALES_FOCUSED',
  'SERVICE_BASED',
  'INVENTORY_BASED',
  'ASSET_BASED',
  'MEMBERSHIP_BASED',
  'HOSPITALITY_BASED',
  'CASE_BASED',
];

export interface TemplateSelectorProps {
  value?: IndustryTemplate;
  onChange: (template: IndustryTemplate) => void;
  disabled?: boolean;
  className?: string;
}

export function TemplateSelector({
  value,
  onChange,
  disabled,
  className,
}: TemplateSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          What best describes your business?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          We'll customize your CRM based on your business type
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => {
          const Icon = templateIcons[template];
          const info = templateDescriptions[template];
          const isSelected = value === template;

          return (
            <button
              key={template}
              type="button"
              onClick={() => onChange(template)}
              disabled={disabled}
              className={cn(
                'relative text-left p-4 rounded-lg border-2 transition-all',
                isSelected
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}

              <Icon
                className={cn(
                  'h-8 w-8 mb-3',
                  isSelected ? 'text-blue-600' : 'text-gray-400'
                )}
              />

              <h3 className={cn(
                'font-medium mb-1',
                isSelected ? 'text-blue-900' : 'text-gray-900'
              )}>
                {info.title}
              </h3>

              <p className="text-sm text-gray-500 mb-2">
                {info.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {info.examples.map((example) => (
                  <span
                    key={example}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
