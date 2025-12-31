import { CRMEntityType } from '@crm/types';
import type { ModuleContext, ModuleRoute, ModulePermission, ModuleSettingDefinition } from '@crm/types';
import { BaseModule } from '../base';

/**
 * Crew Scheduling Module
 *
 * Provides crew management and scheduling functionality for construction companies.
 * Assigns crews to jobs and manages crew calendars.
 */
export class CrewSchedulingModule extends BaseModule {
  key = 'crew_scheduling';
  name = 'Crew Scheduling';
  description = 'Schedule and assign crews to jobs with calendar views and availability tracking';
  version = '1.0.0';
  author = 'CRM SaaS';

  routeBase = '/crews';

  naicsRequirements = {
    sectors: ['23'], // Construction
    templates: ['PROJECT_BASED'],
  };

  requires = ['job_costing']; // Depends on job costing module

  routes: ModuleRoute[] = [
    { path: '/', method: 'GET', handler: 'listCrews' },
    { path: '/:id', method: 'GET', handler: 'getCrew' },
    { path: '/', method: 'POST', handler: 'createCrew', permissions: ['crew_scheduling:create'] },
    { path: '/:id', method: 'PUT', handler: 'updateCrew', permissions: ['crew_scheduling:update'] },
    { path: '/:id', method: 'DELETE', handler: 'deleteCrew', permissions: ['crew_scheduling:delete'] },
    { path: '/:id/members', method: 'GET', handler: 'getCrewMembers' },
    { path: '/:id/members', method: 'POST', handler: 'addCrewMember', permissions: ['crew_scheduling:members'] },
    { path: '/:id/members/:memberId', method: 'DELETE', handler: 'removeCrewMember', permissions: ['crew_scheduling:members'] },
    { path: '/:id/schedule', method: 'GET', handler: 'getCrewSchedule' },
    { path: '/:id/availability', method: 'GET', handler: 'getCrewAvailability' },
    { path: '/assignments', method: 'GET', handler: 'getAssignments' },
    { path: '/assignments', method: 'POST', handler: 'createAssignment', permissions: ['crew_scheduling:assign'] },
    { path: '/assignments/:id', method: 'PUT', handler: 'updateAssignment', permissions: ['crew_scheduling:assign'] },
    { path: '/assignments/:id', method: 'DELETE', handler: 'deleteAssignment', permissions: ['crew_scheduling:assign'] },
    { path: '/calendar', method: 'GET', handler: 'getCalendarView' },
  ];

  navigation = {
    mainNav: {
      label: 'Crews',
      icon: 'users',
      path: '/crews',
      order: 20,
      children: [
        { label: 'All Crews', icon: 'list', path: '/crews' },
        { label: 'Calendar', icon: 'calendar', path: '/crews/calendar' },
        { label: 'Assignments', icon: 'clipboard', path: '/crews/assignments' },
      ],
    },
    settingsNav: {
      label: 'Crew Settings',
      icon: 'settings',
      path: '/settings/crews',
    },
    entityTabs: [
      {
        entityType: CRMEntityType.OPPORTUNITY,
        label: 'Crew',
        path: 'crew',
        order: 2,
      },
    ],
  };

  permissions: ModulePermission[] = [
    {
      key: 'crew_scheduling:view',
      name: 'View Crews',
      description: 'View crew details and schedules',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER'],
    },
    {
      key: 'crew_scheduling:create',
      name: 'Create Crews',
      description: 'Create new crews',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
    {
      key: 'crew_scheduling:update',
      name: 'Update Crews',
      description: 'Edit crew details',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
    {
      key: 'crew_scheduling:delete',
      name: 'Delete Crews',
      description: 'Delete crews',
      defaultRoles: ['OWNER', 'ADMIN'],
    },
    {
      key: 'crew_scheduling:members',
      name: 'Manage Members',
      description: 'Add and remove crew members',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
    {
      key: 'crew_scheduling:assign',
      name: 'Assign Crews',
      description: 'Assign crews to jobs',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
  ];

  settings: ModuleSettingDefinition[] = [
    {
      key: 'default_work_hours_start',
      label: 'Default Work Start Time',
      description: 'Default start time for crew work day',
      type: 'text',
      defaultValue: '07:00',
    },
    {
      key: 'default_work_hours_end',
      label: 'Default Work End Time',
      description: 'Default end time for crew work day',
      type: 'text',
      defaultValue: '17:00',
    },
    {
      key: 'work_days',
      label: 'Work Days',
      description: 'Days crews typically work',
      type: 'multiselect',
      defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      options: [
        { value: 'sunday', label: 'Sunday' },
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
      ],
    },
    {
      key: 'allow_double_booking',
      label: 'Allow Double Booking',
      description: 'Allow crews to be assigned to multiple jobs at the same time',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'travel_time_buffer',
      label: 'Travel Time Buffer (minutes)',
      description: 'Buffer time between assignments for travel',
      type: 'number',
      defaultValue: 30,
      validation: { min: 0, max: 120 },
    },
  ];

  async onActivate(context: ModuleContext): Promise<void> {
    console.log(`Crew Scheduling module activated for tenant ${context.tenantId}`);
  }

  async onDeactivate(context: ModuleContext): Promise<void> {
    console.log(`Crew Scheduling module deactivated for tenant ${context.tenantId}`);
  }
}

export const crewSchedulingModule = new CrewSchedulingModule();
