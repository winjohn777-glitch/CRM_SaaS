'use client';

import { useMemo, useCallback, useState } from 'react';
import { useCRMConfig } from '../contexts/CRMConfigContext';
import type { PipelineConfiguration, PipelineStageConfiguration, PipelineType } from '@crm/types';

export function usePipeline(pipelineType?: PipelineType) {
  const { pipelines, getDefaultPipeline } = useCRMConfig();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);

  const filteredPipelines = useMemo(() => {
    if (!pipelineType) return pipelines;
    return pipelines.filter((p) => p.pipelineType === pipelineType);
  }, [pipelines, pipelineType]);

  const currentPipeline = useMemo(() => {
    if (selectedPipelineId) {
      return pipelines.find((p) => p.id === selectedPipelineId);
    }
    if (pipelineType) {
      return getDefaultPipeline(pipelineType);
    }
    return pipelines.find((p) => p.isDefault) || pipelines[0];
  }, [selectedPipelineId, pipelines, pipelineType, getDefaultPipeline]);

  const stages = useMemo(() => {
    if (!currentPipeline) return [];
    return [...currentPipeline.stages].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [currentPipeline]);

  const initialStage = useMemo(
    () => stages.find((s) => s.isInitial) || stages[0],
    [stages]
  );

  const wonStage = useMemo(
    () => stages.find((s) => s.isWon),
    [stages]
  );

  const lostStage = useMemo(
    () => stages.find((s) => s.isLost),
    [stages]
  );

  const activeStages = useMemo(
    () => stages.filter((s) => !s.isFinal),
    [stages]
  );

  const getStageById = useCallback(
    (stageId: string) => stages.find((s) => s.id === stageId),
    [stages]
  );

  const getNextStage = useCallback(
    (currentStageId: string): PipelineStageConfiguration | undefined => {
      const currentIndex = stages.findIndex((s) => s.id === currentStageId);
      if (currentIndex === -1 || currentIndex >= stages.length - 1) return undefined;
      const nextStage = stages[currentIndex + 1];
      // Skip final stages when getting "next"
      if (nextStage.isFinal) return undefined;
      return nextStage;
    },
    [stages]
  );

  const getPreviousStage = useCallback(
    (currentStageId: string): PipelineStageConfiguration | undefined => {
      const currentIndex = stages.findIndex((s) => s.id === currentStageId);
      if (currentIndex <= 0) return undefined;
      return stages[currentIndex - 1];
    },
    [stages]
  );

  const calculateStageProbability = useCallback(
    (stageId: string): number => {
      const stage = getStageById(stageId);
      return stage?.probability ?? 0;
    },
    [getStageById]
  );

  return {
    pipelines: filteredPipelines,
    currentPipeline,
    stages,
    initialStage,
    wonStage,
    lostStage,
    activeStages,
    selectedPipelineId,
    setSelectedPipelineId,
    getStageById,
    getNextStage,
    getPreviousStage,
    calculateStageProbability,
  };
}
