'use client';

import { useState } from 'react';
import {
  useCRMConfig,
  FeatureToggleGrid,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@crm/ui';
import {
  Settings,
  Users,
  Package,
  Sliders,
  Key,
  Bell,
  Database,
  Shield,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const { configuration, features, modules, isFeatureEnabled, toggleFeature, isModuleEnabled, toggleModule } = useCRMConfig();
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    features.forEach((f) => {
      initial[f.featureKey] = f.enabled;
    });
    return initial;
  });

  const handleFeatureToggle = (featureKey: string, enabled: boolean) => {
    setEnabledFeatures((prev) => ({ ...prev, [featureKey]: enabled }));
    toggleFeature(featureKey, enabled);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Configure your CRM features, modules, and preferences
        </p>
      </div>

      <Tabs defaultValue="features">
        <TabsList>
          <TabsTrigger value="features">
            <Sliders className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="modules">
            <Package className="h-4 w-4 mr-2" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Key className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <FeatureToggleGrid
              enabledFeatures={enabledFeatures}
              onChange={handleFeatureToggle}
            />
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Industry Modules</h3>
                <p className="text-sm text-gray-500">
                  Enable or disable modules specific to your industry
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {configuration?.modules.map((module) => {
                  const enabled = isModuleEnabled(module.moduleKey);
                  return (
                    <Card key={module.moduleKey} className={enabled ? 'ring-2 ring-blue-500' : ''}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{module.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            {module.isRequired && (
                              <Badge variant="warning" size="sm">Required</Badge>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleModule(module.moduleKey, !enabled)}
                              disabled={module.isRequired && enabled}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                enabled ? 'bg-blue-600' : 'bg-gray-200'
                              } ${module.isRequired && enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  enabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">
                          {module.description || 'No description available'}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                  <p className="text-sm text-gray-500">
                    Manage your team and their permissions
                  </p>
                </div>
                <Button>Invite Member</Button>
              </div>

              <div className="border border-gray-200 rounded-lg divide-y">
                {[
                  { name: 'John Doe', email: 'john@example.com', role: 'Owner' },
                  { name: 'Jane Smith', email: 'jane@example.com', role: 'Admin' },
                  { name: 'Bob Johnson', email: 'bob@example.com', role: 'Member' },
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        member.role === 'Owner'
                          ? 'primary'
                          : member.role === 'Admin'
                          ? 'success'
                          : 'default'
                      }
                    >
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
                <p className="text-sm text-gray-500">
                  Connect your CRM with external tools and services
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'QuickBooks', status: 'connected', category: 'Accounting' },
                  { name: 'Google Calendar', status: 'available', category: 'Calendar' },
                  { name: 'EagleView', status: 'available', category: 'Aerial Imagery' },
                  { name: 'Stripe', status: 'available', category: 'Payments' },
                  { name: 'Mailchimp', status: 'available', category: 'Email Marketing' },
                  { name: 'Zapier', status: 'available', category: 'Automation' },
                ].map((integration, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{integration.name}</h4>
                        {integration.status === 'connected' ? (
                          <Badge variant="success" size="sm">
                            <Check className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" size="sm">
                            Available
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{integration.category}</p>
                      <Button
                        variant={integration.status === 'connected' ? 'outline' : 'default'}
                        size="sm"
                        className="w-full"
                      >
                        {integration.status === 'connected' ? 'Manage' : 'Connect'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
