'use client';

import React from 'react';
import { Input } from '../core/Input';
import { Select, type SelectOption } from '../core/Select';
import { cn } from '../../utils/cn';
import type { CustomFieldConfiguration, CustomFieldType } from '@crm/types';
import { Calendar, DollarSign, Mail, Phone, Globe, MapPin } from 'lucide-react';

export interface DynamicFieldRendererProps {
  field: CustomFieldConfiguration;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function DynamicFieldRenderer({
  field,
  value,
  onChange,
  error,
  disabled,
  className,
}: DynamicFieldRendererProps) {
  const renderField = () => {
    switch (field.fieldType) {
      case 'TEXT':
        return (
          <Input
            label={field.label}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.isRequired}
            error={error}
            disabled={disabled}
          />
        );

      case 'TEXTAREA':
        return (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              disabled={disabled}
              className={cn(
                'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-red-500 focus:ring-red-500'
              )}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {field.helpText && !error && (
              <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case 'NUMBER':
      case 'DECIMAL':
        return (
          <Input
            type="number"
            label={field.label}
            value={value !== undefined && value !== null ? String(value) : ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder={field.placeholder}
            required={field.isRequired}
            error={error}
            disabled={disabled}
            step={field.fieldType === 'DECIMAL' ? '0.01' : '1'}
          />
        );

      case 'CURRENCY':
        return (
          <Input
            type="number"
            label={field.label}
            value={value !== undefined && value !== null ? String(value) : ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder={field.placeholder}
            required={field.isRequired}
            error={error}
            disabled={disabled}
            step="0.01"
            leftAddon={<DollarSign className="h-4 w-4 text-gray-400" />}
          />
        );

      case 'DATE':
        return (
          <Input
            type="date"
            label={field.label}
            value={value ? String(value).split('T')[0] : ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.isRequired}
            error={error}
            disabled={disabled}
            leftAddon={<Calendar className="h-4 w-4 text-gray-400" />}
          />
        );

      case 'DATETIME':
        return (
          <Input
            type="datetime-local"
            label={field.label}
            value={value ? String(value).slice(0, 16) : ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.isRequired}
            error={error}
            disabled={disabled}
            leftAddon={<Calendar className="h-4 w-4 text-gray-400" />}
          />
        );

      case 'BOOLEAN':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={field.fieldKey}
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={field.fieldKey} className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
          </div>
        );

      case 'SELECT':
        const options: SelectOption[] = (field.options || []).map((opt) => ({
          value: opt.value,
          label: opt.label,
        }));
        return (
          <Select
            label={field.label}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            options={options}
            placeholder={field.placeholder || `Select ${field.label}`}
            required={field.isRequired}
            error={error}
            disabled={disabled}
          />
        );

      case 'MULTI_SELECT':
        const multiOptions = field.options || [];
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[42px]">
              {multiOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        onChange(selectedValues.filter((v: string) => v !== opt.value));
                      } else {
                        onChange([...selectedValues, opt.value]);
                      }
                    }}
                    disabled={disabled}
                    className={cn(
                      'px-2 py-1 text-sm rounded-full transition-colors',
                      isSelected
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'EMAIL':
        return (
          <Input
            type="email"
            label={field.label}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || 'email@example.com'}
            required={field.isRequired}
            error={error}
            disabled={disabled}
            leftAddon={<Mail className="h-4 w-4 text-gray-400" />}
          />
        );

      case 'PHONE':
        return (
          <Input
            type="tel"
            label={field.label}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || '(555) 123-4567'}
            required={field.isRequired}
            error={error}
            disabled={disabled}
            leftAddon={<Phone className="h-4 w-4 text-gray-400" />}
          />
        );

      case 'URL':
        return (
          <Input
            type="url"
            label={field.label}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || 'https://'}
            required={field.isRequired}
            error={error}
            disabled={disabled}
            leftAddon={<Globe className="h-4 w-4 text-gray-400" />}
          />
        );

      case 'ADDRESS':
        const addressValue = (value as Record<string, string>) || {};
        return (
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              placeholder="Street Address"
              value={addressValue.street || ''}
              onChange={(e) => onChange({ ...addressValue, street: e.target.value })}
              disabled={disabled}
              leftAddon={<MapPin className="h-4 w-4 text-gray-400" />}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="City"
                value={addressValue.city || ''}
                onChange={(e) => onChange({ ...addressValue, city: e.target.value })}
                disabled={disabled}
              />
              <Input
                placeholder="State"
                value={addressValue.state || ''}
                onChange={(e) => onChange({ ...addressValue, state: e.target.value })}
                disabled={disabled}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="ZIP Code"
                value={addressValue.zip || ''}
                onChange={(e) => onChange({ ...addressValue, zip: e.target.value })}
                disabled={disabled}
              />
              <Input
                placeholder="Country"
                value={addressValue.country || ''}
                onChange={(e) => onChange({ ...addressValue, country: e.target.value })}
                disabled={disabled}
              />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        return (
          <Input
            label={field.label}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.isRequired}
            error={error}
            disabled={disabled}
          />
        );
    }
  };

  return <div className={cn('w-full', className)}>{renderField()}</div>;
}
