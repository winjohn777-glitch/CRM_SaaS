'use client';

import React from 'react';
import { DynamicFieldRenderer } from './DynamicFieldRenderer';
import { useCustomFields } from '../../hooks/useCustomFields';
import type { CRMEntityType } from '@crm/types';

export interface CustomFieldsSectionProps {
  entityType: CRMEntityType;
  values: Record<string, unknown>;
  onChange: (fieldKey: string, value: unknown) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  showGroups?: boolean;
}

export function CustomFieldsSection({
  entityType,
  values,
  onChange,
  errors = {},
  disabled,
  showGroups = true,
}: CustomFieldsSectionProps) {
  const { fields, groupedFields } = useCustomFields(entityType);

  if (fields.length === 0) {
    return null;
  }

  if (!showGroups) {
    return (
      <div className="space-y-4">
        {fields.map((field) => (
          <DynamicFieldRenderer
            key={field.fieldKey}
            field={field}
            value={values[field.fieldKey]}
            onChange={(value) => onChange(field.fieldKey, value)}
            error={errors[field.fieldKey]}
            disabled={disabled}
          />
        ))}
      </div>
    );
  }

  const groupNames = Object.keys(groupedFields);

  return (
    <div className="space-y-6">
      {groupNames.map((groupName) => (
        <div key={groupName}>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            {groupName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedFields[groupName].map((field) => (
              <DynamicFieldRenderer
                key={field.fieldKey}
                field={field}
                value={values[field.fieldKey]}
                onChange={(value) => onChange(field.fieldKey, value)}
                error={errors[field.fieldKey]}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
