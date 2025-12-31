'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type {
  MergedConfiguration,
  IndustryTemplate,
  TenantFeature,
  TenantModule,
  CustomFieldConfiguration,
  PipelineConfiguration,
  ActivityTypeConfiguration,
} from '@crm/types';

interface CRMConfigContextValue {
  // Configuration
  configuration: MergedConfiguration | null;
  setConfiguration: (config: MergedConfiguration) => void;

  // Template
  currentTemplate: IndustryTemplate | null;
  naicsCode: string | null;

  // Features
  features: TenantFeature[];
  isFeatureEnabled: (featureKey: string) => boolean;
  toggleFeature: (featureKey: string, enabled: boolean) => void;

  // Modules
  modules: TenantModule[];
  isModuleEnabled: (moduleKey: string) => boolean;
  toggleModule: (moduleKey: string, enabled: boolean) => void;

  // Custom Fields
  customFields: CustomFieldConfiguration[];
  getFieldsForEntity: (entityType: string) => CustomFieldConfiguration[];

  // Pipelines
  pipelines: PipelineConfiguration[];
  getDefaultPipeline: (pipelineType: string) => PipelineConfiguration | undefined;

  // Activity Types
  activityTypes: ActivityTypeConfiguration[];

  // Loading state
  isLoading: boolean;
  error: string | null;
}

const CRMConfigContext = createContext<CRMConfigContextValue | undefined>(undefined);

interface CRMConfigProviderProps {
  children: ReactNode;
  initialConfig?: MergedConfiguration;
}

export function CRMConfigProvider({ children, initialConfig }: CRMConfigProviderProps) {
  const [configuration, setConfigurationState] = useState<MergedConfiguration | null>(
    initialConfig || null
  );
  const [features, setFeatures] = useState<TenantFeature[]>([]);
  const [modules, setModules] = useState<TenantModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setConfiguration = useCallback((config: MergedConfiguration) => {
    setConfigurationState(config);

    // Initialize features from config
    const defaultFeatures: TenantFeature[] = [
      { id: '1', tenantId: '', featureKey: 'contacts', enabled: true },
      { id: '2', tenantId: '', featureKey: 'accounts', enabled: true },
      { id: '3', tenantId: '', featureKey: 'opportunities', enabled: true },
      { id: '4', tenantId: '', featureKey: 'activities', enabled: true },
      { id: '5', tenantId: '', featureKey: 'documents', enabled: true },
      { id: '6', tenantId: '', featureKey: 'reports', enabled: true },
      { id: '7', tenantId: '', featureKey: 'email_integration', enabled: false },
      { id: '8', tenantId: '', featureKey: 'calendar', enabled: true },
      { id: '9', tenantId: '', featureKey: 'team_users', enabled: true },
      { id: '10', tenantId: '', featureKey: 'api_access', enabled: false },
      { id: '11', tenantId: '', featureKey: 'automations', enabled: false },
      { id: '12', tenantId: '', featureKey: 'mobile_app', enabled: false },
    ];
    setFeatures(defaultFeatures);

    // Initialize modules from config
    const configModules: TenantModule[] = config.modules.map((m, idx) => ({
      id: String(idx + 1),
      tenantId: '',
      moduleKey: m.moduleKey,
      enabled: m.isEnabled,
      config: m.defaultConfig || null,
    }));
    setModules(configModules);
  }, []);

  const isFeatureEnabled = useCallback(
    (featureKey: string) => {
      const feature = features.find((f) => f.featureKey === featureKey);
      return feature?.enabled ?? false;
    },
    [features]
  );

  const toggleFeature = useCallback((featureKey: string, enabled: boolean) => {
    setFeatures((prev) =>
      prev.map((f) => (f.featureKey === featureKey ? { ...f, enabled } : f))
    );
  }, []);

  const isModuleEnabled = useCallback(
    (moduleKey: string) => {
      const module = modules.find((m) => m.moduleKey === moduleKey);
      return module?.enabled ?? false;
    },
    [modules]
  );

  const toggleModule = useCallback((moduleKey: string, enabled: boolean) => {
    setModules((prev) =>
      prev.map((m) => (m.moduleKey === moduleKey ? { ...m, enabled } : m))
    );
  }, []);

  const getFieldsForEntity = useCallback(
    (entityType: string) => {
      if (!configuration) return [];
      return configuration.customFields.filter((f) => f.entityType === entityType);
    },
    [configuration]
  );

  const getDefaultPipeline = useCallback(
    (pipelineType: string) => {
      if (!configuration) return undefined;
      return configuration.pipelines.find(
        (p) => p.pipelineType === pipelineType && p.isDefault
      );
    },
    [configuration]
  );

  const value: CRMConfigContextValue = {
    configuration,
    setConfiguration,
    currentTemplate: configuration?.template || null,
    naicsCode: configuration?.naicsCode || null,
    features,
    isFeatureEnabled,
    toggleFeature,
    modules,
    isModuleEnabled,
    toggleModule,
    customFields: configuration?.customFields || [],
    getFieldsForEntity,
    pipelines: configuration?.pipelines || [],
    getDefaultPipeline,
    activityTypes: configuration?.activityTypes || [],
    isLoading,
    error,
  };

  return <CRMConfigContext.Provider value={value}>{children}</CRMConfigContext.Provider>;
}

export function useCRMConfig() {
  const context = useContext(CRMConfigContext);
  if (context === undefined) {
    throw new Error('useCRMConfig must be used within a CRMConfigProvider');
  }
  return context;
}
