'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../core/Card';
import { Badge } from '../core/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../core/Tabs';
import { cn } from '../../utils/cn';
import type { MergedConfiguration } from '@crm/types';
import {
  Target,
  FileText,
  Calendar,
  Package,
  Check,
  ArrowRight,
} from 'lucide-react';

export interface CRMPreviewStepProps {
  configuration: MergedConfiguration;
  className?: string;
}

export function CRMPreviewStep({ configuration, className }: CRMPreviewStepProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Preview Your CRM Configuration
        </h2>
        <p className="text-sm text-gray-500">
          Based on your selections, here's what your CRM will include
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-gray-900">
            {configuration.pipelines.length}
          </div>
          <div className="text-sm text-gray-500">Pipelines</div>
        </Card>

        <Card className="p-4 text-center">
          <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-gray-900">
            {configuration.customFields.length}
          </div>
          <div className="text-sm text-gray-500">Custom Fields</div>
        </Card>

        <Card className="p-4 text-center">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold text-gray-900">
            {configuration.activityTypes.length}
          </div>
          <div className="text-sm text-gray-500">Activity Types</div>
        </Card>

        <Card className="p-4 text-center">
          <Package className="h-8 w-8 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold text-gray-900">
            {configuration.modules.filter((m) => m.isEnabled).length}
          </div>
          <div className="text-sm text-gray-500">Modules</div>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="pipelines">
        <TabsList>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="fields">Custom Fields</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>

        {/* Pipelines Tab */}
        <TabsContent value="pipelines">
          <div className="space-y-4">
            {configuration.pipelines.map((pipeline, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{pipeline.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{pipeline.pipelineType}</Badge>
                      {pipeline.isDefault && (
                        <Badge variant="primary">Default</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 flex-wrap">
                    {pipeline.stages.map((stage, stageIdx) => (
                      <React.Fragment key={stageIdx}>
                        <div
                          className="px-3 py-1.5 rounded-lg text-sm font-medium"
                          style={{
                            backgroundColor: `${stage.color || '#E5E7EB'}20`,
                            color: stage.color || '#374151',
                          }}
                        >
                          {stage.name}
                          {stage.probability !== undefined && (
                            <span className="ml-1 text-xs opacity-75">
                              ({stage.probability}%)
                            </span>
                          )}
                        </div>
                        {stageIdx < pipeline.stages.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-300" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom Fields Tab */}
        <TabsContent value="fields">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {Object.entries(
                  configuration.customFields.reduce<Record<string, typeof configuration.customFields>>(
                    (acc, field) => {
                      const entity = field.entityType;
                      if (!acc[entity]) acc[entity] = [];
                      acc[entity].push(field);
                      return acc;
                    },
                    {}
                  )
                ).map(([entityType, fields]) => (
                  <div key={entityType}>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {entityType} Fields
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {fields.map((field, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                        >
                          <Badge variant="outline" size="sm">
                            {field.fieldType}
                          </Badge>
                          <span className="text-sm text-gray-700 truncate">
                            {field.label}
                          </span>
                          {field.isRequired && (
                            <span className="text-red-500 text-xs">*</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {configuration.activityTypes.map((activity, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" size="sm">
                        {activity.category}
                      </Badge>
                    </div>
                    <p className="font-medium text-gray-900 text-sm">
                      {activity.name}
                    </p>
                    {activity.durationDefault && (
                      <p className="text-xs text-gray-500 mt-1">
                        Default: {activity.durationDefault} min
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {configuration.modules.map((module, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      module.isEnabled
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center',
                          module.isEnabled
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        )}
                      >
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{module.name}</p>
                        {module.description && (
                          <p className="text-xs text-gray-500">
                            {module.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {module.isRequired && (
                        <Badge variant="warning" size="sm">Required</Badge>
                      )}
                      {module.isEnabled ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Enabled</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Disabled</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
