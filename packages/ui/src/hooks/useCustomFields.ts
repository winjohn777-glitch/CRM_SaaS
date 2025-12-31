'use client';

import { useMemo, useCallback } from 'react';
import { useCRMConfig } from '../contexts/CRMConfigContext';
import type { CustomFieldConfiguration, CRMEntityType } from '@crm/types';

export function useCustomFields(entityType: CRMEntityType) {
  const { customFields, getFieldsForEntity } = useCRMConfig();

  const fields = useMemo(() => getFieldsForEntity(entityType), [getFieldsForEntity, entityType]);

  const requiredFields = useMemo(
    () => fields.filter((f) => f.isRequired),
    [fields]
  );

  const searchableFields = useMemo(
    () => fields.filter((f) => f.isSearchable),
    [fields]
  );

  const filterableFields = useMemo(
    () => fields.filter((f) => f.isFilterable),
    [fields]
  );

  const groupedFields = useMemo(() => {
    const groups: Record<string, CustomFieldConfiguration[]> = {};
    fields.forEach((field) => {
      const groupName = field.groupName || 'General';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(field);
    });

    // Sort fields within each group
    Object.values(groups).forEach((group) => {
      group.sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return groups;
  }, [fields]);

  const validateFieldValue = useCallback(
    (fieldKey: string, value: unknown): { valid: boolean; error?: string } => {
      const field = fields.find((f) => f.fieldKey === fieldKey);
      if (!field) return { valid: true };

      // Required validation
      if (field.isRequired && (value === undefined || value === null || value === '')) {
        return { valid: false, error: `${field.label} is required` };
      }

      // Type-specific validation
      if (field.validation) {
        const validation = field.validation as Record<string, unknown>;

        // Min/max for numbers
        if (field.fieldType === 'NUMBER' || field.fieldType === 'DECIMAL' || field.fieldType === 'CURRENCY') {
          const numValue = Number(value);
          if (validation.min !== undefined && numValue < (validation.min as number)) {
            return { valid: false, error: `${field.label} must be at least ${validation.min}` };
          }
          if (validation.max !== undefined && numValue > (validation.max as number)) {
            return { valid: false, error: `${field.label} must be at most ${validation.max}` };
          }
        }

        // Pattern for text
        if (field.fieldType === 'TEXT' && validation.pattern) {
          const regex = new RegExp(validation.pattern as string);
          if (!regex.test(String(value))) {
            return { valid: false, error: validation.patternMessage as string || `${field.label} format is invalid` };
          }
        }
      }

      return { valid: true };
    },
    [fields]
  );

  const getFieldByKey = useCallback(
    (fieldKey: string) => fields.find((f) => f.fieldKey === fieldKey),
    [fields]
  );

  return {
    fields,
    requiredFields,
    searchableFields,
    filterableFields,
    groupedFields,
    validateFieldValue,
    getFieldByKey,
  };
}
