'use client';

import React from 'react';
import { Card } from '../core/Card';
import { Badge } from '../core/Badge';
import { cn } from '../../utils/cn';
import type { CRMContact } from '@crm/types';
import { Mail, Phone, Building2, User, MoreVertical } from 'lucide-react';

export interface ContactCardProps {
  contact: CRMContact;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
}

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  PROSPECT: 'info',
  CUSTOMER: 'success',
  FORMER_CUSTOMER: 'warning',
};

export function ContactCard({
  contact,
  onClick,
  onEdit,
  onDelete,
  className,
  showActions = true,
  compact = false,
}: ContactCardProps) {
  const fullName = `${contact.firstName} ${contact.lastName}`.trim();
  const initials = `${contact.firstName?.[0] || ''}${contact.lastName?.[0] || ''}`.toUpperCase();

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm cursor-pointer transition-shadow',
          className
        )}
        onClick={onClick}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
          {initials || <User className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 truncate">
            {fullName || 'Unknown'}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {contact.email || contact.phone || 'No contact info'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
          {initials || <User className="h-6 w-6" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3
                className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                onClick={onClick}
              >
                {fullName || 'Unknown Contact'}
              </h3>
              {contact.title && (
                <p className="text-sm text-gray-500">{contact.title}</p>
              )}
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-2">
              <Badge variant={statusVariants[contact.status] || 'default'}>
                {contact.status}
              </Badge>

              {showActions && (onEdit || onDelete) && (
                <div className="relative group">
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={onEdit}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={onDelete}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-3 space-y-1.5">
            {contact.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {contact.email}
                </a>
              </div>
            )}

            {contact.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <a
                  href={`tel:${contact.phone}`}
                  className="hover:text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {contact.phone}
                </a>
              </div>
            )}

            {contact.accountId && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span>Account linked</span>
              </div>
            )}
          </div>

          {/* Source */}
          {contact.source && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Source: {contact.source}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
