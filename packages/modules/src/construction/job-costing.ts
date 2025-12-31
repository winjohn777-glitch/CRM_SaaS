import { CRMEntityType } from '@crm/types';
import type { ModuleContext, ModuleRoute, ModulePermission, ModuleSettingDefinition } from '@crm/types';
import { BaseModule } from '../base';

/**
 * Job Costing Module
 *
 * Provides job/project costing functionality for construction companies.
 * Tracks labor, materials, and overhead costs per job.
 */
export class JobCostingModule extends BaseModule {
  key = 'job_costing';
  name = 'Job Costing';
  description = 'Track costs, labor, and materials per job with budget vs actual analysis';
  version = '1.0.0';
  author = 'CRM SaaS';

  routeBase = '/jobs';

  naicsRequirements = {
    sectors: ['23'], // Construction
    templates: ['PROJECT_BASED'],
  };

  routes: ModuleRoute[] = [
    { path: '/', method: 'GET', handler: 'listJobs' },
    { path: '/:id', method: 'GET', handler: 'getJob' },
    { path: '/', method: 'POST', handler: 'createJob', permissions: ['job_costing:create'] },
    { path: '/:id', method: 'PUT', handler: 'updateJob', permissions: ['job_costing:update'] },
    { path: '/:id', method: 'DELETE', handler: 'deleteJob', permissions: ['job_costing:delete'] },
    { path: '/:id/costs', method: 'GET', handler: 'getJobCosts' },
    { path: '/:id/costs', method: 'POST', handler: 'addJobCost', permissions: ['job_costing:costs'] },
    { path: '/:id/labor', method: 'GET', handler: 'getJobLabor' },
    { path: '/:id/labor', method: 'POST', handler: 'addJobLabor', permissions: ['job_costing:labor'] },
    { path: '/:id/materials', method: 'GET', handler: 'getJobMaterials' },
    { path: '/:id/profitability', method: 'GET', handler: 'getJobProfitability' },
    { path: '/reports/summary', method: 'GET', handler: 'getCostingSummary' },
    { path: '/reports/comparison', method: 'GET', handler: 'getBudgetComparison' },
  ];

  navigation = {
    mainNav: {
      label: 'Jobs',
      icon: 'briefcase',
      path: '/jobs',
      order: 10,
      children: [
        { label: 'All Jobs', icon: 'list', path: '/jobs' },
        { label: 'Active Jobs', icon: 'activity', path: '/jobs?status=active' },
        { label: 'Job Costing', icon: 'dollar-sign', path: '/jobs/costing' },
      ],
    },
    settingsNav: {
      label: 'Job Costing Settings',
      icon: 'settings',
      path: '/settings/job-costing',
    },
    entityTabs: [
      {
        entityType: CRMEntityType.OPPORTUNITY,
        label: 'Job',
        path: 'job',
        order: 1,
      },
    ],
  };

  permissions: ModulePermission[] = [
    {
      key: 'job_costing:view',
      name: 'View Jobs',
      description: 'View job details and costs',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER'],
    },
    {
      key: 'job_costing:create',
      name: 'Create Jobs',
      description: 'Create new jobs',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
    {
      key: 'job_costing:update',
      name: 'Update Jobs',
      description: 'Edit job details',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
    {
      key: 'job_costing:delete',
      name: 'Delete Jobs',
      description: 'Delete jobs',
      defaultRoles: ['OWNER', 'ADMIN'],
    },
    {
      key: 'job_costing:costs',
      name: 'Manage Costs',
      description: 'Add and edit job costs',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
    {
      key: 'job_costing:labor',
      name: 'Manage Labor',
      description: 'Add and edit labor entries',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
    {
      key: 'job_costing:reports',
      name: 'View Reports',
      description: 'View job costing reports',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
  ];

  settings: ModuleSettingDefinition[] = [
    {
      key: 'default_markup_percentage',
      label: 'Default Markup Percentage',
      description: 'Default markup to apply to job costs',
      type: 'number',
      defaultValue: 20,
      validation: { min: 0, max: 100 },
    },
    {
      key: 'default_labor_rate',
      label: 'Default Labor Rate ($/hr)',
      description: 'Default hourly rate for labor',
      type: 'number',
      defaultValue: 50,
      validation: { min: 0 },
    },
    {
      key: 'overhead_percentage',
      label: 'Overhead Percentage',
      description: 'Overhead percentage to include in job costs',
      type: 'number',
      defaultValue: 15,
      validation: { min: 0, max: 100 },
    },
    {
      key: 'auto_create_job',
      label: 'Auto-Create Job from Opportunity',
      description: 'Automatically create a job when opportunity is won',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'job_number_prefix',
      label: 'Job Number Prefix',
      description: 'Prefix for auto-generated job numbers',
      type: 'text',
      defaultValue: 'JOB-',
    },
  ];

  async onActivate(context: ModuleContext): Promise<void> {
    // Initialize job costing for tenant
    console.log(`Job Costing module activated for tenant ${context.tenantId}`);
  }

  async onDeactivate(context: ModuleContext): Promise<void> {
    // Cleanup if needed
    console.log(`Job Costing module deactivated for tenant ${context.tenantId}`);
  }
}

export const jobCostingModule = new JobCostingModule();
