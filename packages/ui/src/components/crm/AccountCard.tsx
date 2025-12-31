'use client';

import React from 'react';
import { Card } from '../core/Card';
import { Badge } from '../core/Badge';
import { cn } from '../../utils/cn';
import type { CRMAccount } from '@crm/types';
import {
  Building2,
  Globe,
  Users,
  DollarSign,
  MapPin,
  MoreVertical,
} from 'lucide-react';

export interface AccountCardProps {
  account: CRMAccount;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
}

const typeVariants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'> = {
  PROSPECT: 'info',
  CUSTOMER: 'success',
  PARTNER: 'purple',
  VENDOR: 'warning',
  COMPETITOR: 'danger',
};

export function AccountCard({
  account,
  onClick,
  onEdit,
  onDelete,
  className,
  showActions = true,
  compact = false,
}: AccountCardProps) {
  const initials = account.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const address = account.address as { city?: string; state?: string } | null;

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm cursor-pointer transition-shadow',
          className
        )}
        onClick={onClick}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-medium">
          {initials || <Building2 className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 truncate">
            {account.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {account.industry || 'No industry'}
          </div>
        </div>
        <Badge variant={typeVariants[account.accountType] || 'default'} size="sm">
          {account.accountType}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center font-medium">
          {initials || <Building2 className="h-6 w-6" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3
                className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                onClick={onClick}
              >
                {account.name}
              </h3>
              {account.industry && (
                <p className="text-sm text-gray-500">{account.industry}</p>
              )}
            </div>

            {/* Type & Actions */}
            <div className="flex items-center gap-2">
              <Badge variant={typeVariants[account.accountType] || 'default'}>
                {account.accountType}
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

          {/* Details */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            {account.website && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="h-4 w-4 text-gray-400" />
                <a
                  href={account.website.startsWith('http') ? account.website : `https://${account.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {account.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {account.employeeCount && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-gray-400" />
                <span>{account.employeeCount} employees</span>
              </div>
            )}

            {account.annualRevenue && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span>{account.annualRevenue}</span>
              </div>
            )}

            {address && (address.city || address.state) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>
                  {[address.city, address.state].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
