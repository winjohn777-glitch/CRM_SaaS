'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { useModules } from '../../hooks/useModules';
import { cn } from '../../utils/cn';
import { Loader2, Package, AlertCircle } from 'lucide-react';

export interface ModuleRoute {
  moduleKey: string;
  path: string;
  component: ComponentType<ModuleComponentProps>;
}

export interface ModuleComponentProps {
  moduleKey: string;
  config?: Record<string, unknown>;
}

export interface ModuleRouterProps {
  currentPath: string;
  routes: ModuleRoute[];
  fallback?: React.ReactNode;
  notFoundComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  className?: string;
}

export function ModuleRouter({
  currentPath,
  routes,
  fallback,
  notFoundComponent,
  loadingComponent,
  className,
}: ModuleRouterProps) {
  const { isModuleEnabled, getModuleConfig } = useModules();

  // Find matching route
  const matchingRoute = routes.find((route) => {
    const config = getModuleConfig(route.moduleKey);
    if (!config?.routeBase) return false;
    return currentPath.startsWith(config.routeBase);
  });

  // Check if module is enabled
  if (matchingRoute && !isModuleEnabled(matchingRoute.moduleKey)) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-64', className)}>
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Module Not Enabled</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          This module is not currently enabled for your account.
          Please contact your administrator to enable it.
        </p>
      </div>
    );
  }

  // Render matching route
  if (matchingRoute) {
    const Component = matchingRoute.component;
    const moduleConfig = getModuleConfig(matchingRoute.moduleKey);

    return (
      <Suspense
        fallback={
          loadingComponent || (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )
        }
      >
        <div className={className}>
          <Component
            moduleKey={matchingRoute.moduleKey}
            config={moduleConfig?.defaultConfig as Record<string, unknown>}
          />
        </div>
      </Suspense>
    );
  }

  // No matching route
  if (notFoundComponent) {
    return <>{notFoundComponent}</>;
  }

  // Default fallback
  return fallback || null;
}

// Module placeholder component for development
export function ModulePlaceholder({
  moduleKey,
  config,
}: ModuleComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <Package className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {moduleKey} Module
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-md">
        This module is under development. Check back soon!
      </p>
      {config && (
        <details className="mt-4 text-xs text-gray-400">
          <summary className="cursor-pointer">View Config</summary>
          <pre className="mt-2 p-2 bg-white rounded border border-gray-200 overflow-auto max-w-md">
            {JSON.stringify(config, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

// Lazy loading wrapper for module components
export function createLazyModuleComponent(
  importFn: () => Promise<{ default: ComponentType<ModuleComponentProps> }>
) {
  return lazy(importFn);
}
