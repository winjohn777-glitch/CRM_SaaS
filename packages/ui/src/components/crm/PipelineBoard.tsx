'use client';

import React, { useState, useCallback } from 'react';
import { PipelineStageCard } from './PipelineStageCard';
import { usePipeline } from '../../hooks/usePipeline';
import { Select, type SelectOption } from '../core/Select';
import { cn } from '../../utils/cn';
import type { PipelineType, CRMOpportunity } from '@crm/types';
import { Plus, Filter, LayoutGrid, List } from 'lucide-react';
import { Button } from '../core/Button';

export interface PipelineBoardProps {
  pipelineType?: PipelineType;
  opportunities: CRMOpportunity[];
  onOpportunityClick?: (opportunity: CRMOpportunity) => void;
  onOpportunityMove?: (opportunityId: string, newStageId: string) => void;
  onCreateOpportunity?: (stageId?: string) => void;
  className?: string;
}

export function PipelineBoard({
  pipelineType = 'SALES',
  opportunities,
  onOpportunityClick,
  onOpportunityMove,
  onCreateOpportunity,
  className,
}: PipelineBoardProps) {
  const {
    pipelines,
    currentPipeline,
    stages,
    selectedPipelineId,
    setSelectedPipelineId,
  } = usePipeline(pipelineType);

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [draggedOpportunity, setDraggedOpportunity] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const pipelineOptions: SelectOption[] = pipelines.map((p) => ({
    value: p.id || '',
    label: p.name,
  }));

  const getOpportunitiesForStage = useCallback(
    (stageId: string) => {
      return opportunities.filter((opp) => opp.stageId === stageId);
    },
    [opportunities]
  );

  const handleDragStart = (opportunityId: string) => {
    setDraggedOpportunity(opportunityId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (stageId: string) => {
    if (draggedOpportunity && onOpportunityMove) {
      onOpportunityMove(draggedOpportunity, stageId);
    }
    setDraggedOpportunity(null);
    setDragOverStage(null);
  };

  const calculateStageStats = (stageId: string) => {
    const stageOpps = getOpportunitiesForStage(stageId);
    const totalValue = stageOpps.reduce(
      (sum, opp) => sum + (Number(opp.amount) || 0),
      0
    );
    return {
      count: stageOpps.length,
      totalValue,
    };
  };

  if (!currentPipeline) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No pipeline configured
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          {pipelines.length > 1 && (
            <Select
              value={selectedPipelineId || currentPipeline.id || ''}
              onChange={(e) => setSelectedPipelineId(e.target.value)}
              options={pipelineOptions}
              className="w-48"
            />
          )}
          <h2 className="text-lg font-semibold text-gray-900">
            {currentPipeline.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={cn(
                'p-2 rounded-l-md',
                viewMode === 'board'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-r-md',
                viewMode === 'list'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter className="h-4 w-4" />}
          >
            Filter
          </Button>

          {onCreateOpportunity && (
            <Button
              size="sm"
              onClick={() => onCreateOpportunity()}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Opportunity
            </Button>
          )}
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 h-full min-w-max pb-4">
            {stages.map((stage) => {
              const stats = calculateStageStats(stage.id || '');
              const stageOpportunities = getOpportunitiesForStage(stage.id || '');
              const isDragOver = dragOverStage === stage.id;

              return (
                <PipelineStageCard
                  key={stage.id}
                  stage={stage}
                  opportunities={stageOpportunities}
                  stats={stats}
                  isDragOver={isDragOver}
                  onDragOver={(e) => handleDragOver(e, stage.id || '')}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(stage.id || '')}
                  onOpportunityClick={onOpportunityClick}
                  onOpportunityDragStart={handleDragStart}
                  onCreateOpportunity={
                    onCreateOpportunity && !stage.isFinal
                      ? () => onCreateOpportunity(stage.id)
                      : undefined
                  }
                />
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probability
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Close
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {opportunities.map((opp) => {
                const stage = stages.find((s) => s.id === opp.stageId);
                return (
                  <tr
                    key={opp.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onOpportunityClick?.(opp)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{opp.name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${stage?.color || '#E5E7EB'}20`,
                          color: stage?.color || '#374151',
                        }}
                      >
                        {stage?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      ${Number(opp.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {opp.probability}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {opp.expectedCloseDate
                        ? new Date(opp.expectedCloseDate).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
