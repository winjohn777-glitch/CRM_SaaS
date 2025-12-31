'use client';

import { useMemo, useCallback } from 'react';
import { useCRMConfig } from '../contexts/CRMConfigContext';
import type { TenantModule, IndustryModuleConfiguration } from '@crm/types';

export function useModules() {
  const { configuration, modules, isModuleEnabled, toggleModule } = useCRMConfig();

  const availableModules = useMemo(() => {
    if (!configuration) return [];
    return configuration.modules;
  }, [configuration]);

  const enabledModules = useMemo(
    () => modules.filter((m) => m.enabled),
    [modules]
  );

  const requiredModules = useMemo(
    () => availableModules.filter((m) => m.isRequired),
    [availableModules]
  );

  const optionalModules = useMemo(
    () => availableModules.filter((m) => !m.isRequired),
    [availableModules]
  );

  const getModuleConfig = useCallback(
    (moduleKey: string): IndustryModuleConfiguration | undefined => {
      return availableModules.find((m) => m.moduleKey === moduleKey);
    },
    [availableModules]
  );

  const getModuleRouteBase = useCallback(
    (moduleKey: string): string | undefined => {
      const module = getModuleConfig(moduleKey);
      return module?.routeBase;
    },
    [getModuleConfig]
  );

  const canToggleModule = useCallback(
    (moduleKey: string): boolean => {
      const module = getModuleConfig(moduleKey);
      // Required modules cannot be toggled off
      if (module?.isRequired && isModuleEnabled(moduleKey)) {
        return false;
      }
      return true;
    },
    [getModuleConfig, isModuleEnabled]
  );

  const getEnabledModuleRoutes = useCallback(() => {
    return enabledModules
      .map((m) => {
        const config = getModuleConfig(m.moduleKey);
        return config?.routeBase;
      })
      .filter(Boolean) as string[];
  }, [enabledModules, getModuleConfig]);

  return {
    availableModules,
    enabledModules,
    requiredModules,
    optionalModules,
    isModuleEnabled,
    toggleModule,
    getModuleConfig,
    getModuleRouteBase,
    canToggleModule,
    getEnabledModuleRoutes,
  };
}
