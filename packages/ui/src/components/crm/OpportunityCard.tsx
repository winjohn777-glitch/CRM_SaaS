'use client';

import React from 'react';
import { Card } from '../core/Card';
import { Badge } from '../core/Badge';
import { cn } from '../../utils/cn';
import type { CRMOpportunity } from '@crm/types';
import { DollarSign, Calendar, User, Building2 } from 'lucide-react';

export interface OpportunityCardProps {
  opportunity: CRMOpportunity;
  onClick?: () => void;
  onDragStart?: () => void;
  draggable?: boolean;
  className?: string;
  compact?: boolean;
}

export function OpportunityCard({
  opportunity,
  onClick,
  onDragStart,
  draggable,
  className,
  compact = false,
}: OpportunityCardProps) {
  const statusVariant =
    opportunity.status === 'WON'
      ? 'success'
      : opportunity.status === 'LOST'
      ? 'danger'
      : 'default';

  if (compact) {
    return (
      <div
        className={cn(
          'p-2 bg-white rounded border border-gray-200 hover:shadow-sm cursor-pointer transition-shadow',
          className
        )}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
      >
        <div className="font-medium text-sm text-gray-900 truncate">
          {opportunity.name}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          ${Number(opportunity.amount || 0).toLocaleString()}
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        'p-3 hover:shadow-md cursor-pointer transition-shadow',
        draggable && 'cursor-grab active:cursor-grabbing',
        className
      )}
      onClick={onClick}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.();
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
          {opportunity.name}
        </h4>
        {opportunity.status !== 'OPEN' && (
          <Badge variant={statusVariant} size="sm">
            {opportunity.status}
          </Badge>
        )}
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        {/* Amount */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">
            ${Number(opportunity.amount || 0).toLocaleString()}
          </span>
          {opportunity.probability !== undefined && (
            <span className="text-gray-500 text-xs">
              ({opportunity.probability}%)
            </span>
          )}
        </div>

        {/* Expected Close */}
        {opportunity.expectedCloseDate && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Close: {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Account */}
        {opportunity.accountId && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Building2 className="h-3.5 w-3.5" />
            <span className="truncate">Account associated</span>
          </div>
        )}

        {/* Assigned To */}
        {opportunity.assignedToId && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="h-3.5 w-3.5" />
            <span className="truncate">Assigned</span>
          </div>
        )}
      </div>

      {/* Tags from custom fields */}
      {opportunity.customFields && Object.keys(opportunity.customFields).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {Object.entries(opportunity.customFields)
            .slice(0, 2)
            .map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600"
              >
                {String(value)}
              </span>
            ))}
        </div>
      )}
    </Card>
  );
}
