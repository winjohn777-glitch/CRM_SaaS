'use client';

import React from 'react';
import { OpportunityCard } from './OpportunityCard';
import { cn } from '../../utils/cn';
import type { PipelineStageConfiguration, CRMOpportunity } from '@crm/types';
import { Plus } from 'lucide-react';

export interface PipelineStageCardProps {
  stage: PipelineStageConfiguration;
  opportunities: CRMOpportunity[];
  stats: { count: number; totalValue: number };
  isDragOver?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: () => void;
  onOpportunityClick?: (opportunity: CRMOpportunity) => void;
  onOpportunityDragStart?: (opportunityId: string) => void;
  onCreateOpportunity?: () => void;
  className?: string;
}

export function PipelineStageCard({
  stage,
  opportunities,
  stats,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpportunityClick,
  onOpportunityDragStart,
  onCreateOpportunity,
  className,
}: PipelineStageCardProps) {
  const stageColor = stage.color || '#6B7280';

  return (
    <div
      className={cn(
        'flex flex-col w-72 bg-gray-50 rounded-lg',
        isDragOver && 'ring-2 ring-blue-500 ring-offset-2',
        className
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.();
      }}
    >
      {/* Stage Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stageColor }}
            />
            <h3 className="font-medium text-gray-900 text-sm">{stage.name}</h3>
          </div>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
            {stats.count}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>${stats.totalValue.toLocaleString()}</span>
          {stage.probability !== undefined && (
            <span>{stage.probability}% probability</span>
          )}
        </div>
      </div>

      {/* Opportunities */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px] max-h-[500px]">
        {opportunities.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-sm text-gray-400">
            No opportunities
          </div>
        ) : (
          opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onClick={() => onOpportunityClick?.(opportunity)}
              onDragStart={() => onOpportunityDragStart?.(opportunity.id)}
              draggable
            />
          ))
        )}
      </div>

      {/* Add Button */}
      {onCreateOpportunity && (
        <div className="p-2 border-t border-gray-200">
          <button
            type="button"
            onClick={onCreateOpportunity}
            className="w-full flex items-center justify-center gap-1 p-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      )}
    </div>
  );
}
