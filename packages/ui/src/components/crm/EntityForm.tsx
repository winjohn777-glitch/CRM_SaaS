'use client';

import React, { ReactNode } from 'react';
import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { Button } from '../core/Button';
import { CustomFieldsSection } from './CustomFieldsSection';
import { cn } from '../../utils/cn';
import type { CRMEntityType } from '@crm/types';

export interface EntityFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onCancel?: () => void;
  entityType: CRMEntityType;
  children: (form: UseFormReturn<T>) => ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  className?: string;
  showCustomFields?: boolean;
}

export function EntityForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  entityType,
  children,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isLoading,
  className,
  showCustomFields = true,
}: EntityFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [customFieldValues, setCustomFieldValues] = React.useState<Record<string, unknown>>(
    (defaultValues as Record<string, unknown>)?.customFields as Record<string, unknown> || {}
  );
  const [customFieldErrors, setCustomFieldErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = form.handleSubmit(async (data) => {
    // Merge custom fields into the data
    const submitData = {
      ...data,
      customFields: customFieldValues,
    };
    await onSubmit(submitData as T);
  });

  const handleCustomFieldChange = (fieldKey: string, value: unknown) => {
    setCustomFieldValues((prev) => ({ ...prev, [fieldKey]: value }));
    // Clear error when field changes
    if (customFieldErrors[fieldKey]) {
      setCustomFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Core Fields */}
      <div className="space-y-4">{children(form)}</div>

      {/* Custom Fields */}
      {showCustomFields && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Additional Information
          </h3>
          <CustomFieldsSection
            entityType={entityType}
            values={customFieldValues}
            onChange={handleCustomFieldChange}
            errors={customFieldErrors}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

// Helper component for form fields
export interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
