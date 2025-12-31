import {
  IndustryTemplate,
  PipelineType,
  CustomFieldType,
  CRMEntityType,
  ActivityCategory,
} from '@crm/types';
import type {
  TemplateDefinition,
  PipelineConfiguration,
  CustomFieldConfiguration,
  ActivityTypeConfiguration,
} from '@crm/types';

/**
 * 8 Industry Group Templates
 * These serve as the base configurations that are extended by sector-specific configs
 */
export const TemplateDefinitions: Record<IndustryTemplate, TemplateDefinition> = {
  [IndustryTemplate.PROJECT_BASED]: {
    template: IndustryTemplate.PROJECT_BASED,
    name: 'Project-Based CRM',
    description: 'For businesses that manage projects with timelines, resources, and deliverables',
    sectors: ['23', '51', '54'], // Construction, Information, Professional Services
    focus: 'Jobs, estimates, timelines, resources, deliverables',
    defaultPipelines: [
      {
        name: 'Project Sales Pipeline',
        pipelineType: PipelineType.SALES,
        isDefault: true,
        stages: [
          { name: 'Lead', sortOrder: 1, probability: 10, isInitial: true, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Qualified', sortOrder: 2, probability: 20, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Estimate Prepared', sortOrder: 3, probability: 40, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Proposal Sent', sortOrder: 4, probability: 50, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Negotiation', sortOrder: 5, probability: 70, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Contract Signed', sortOrder: 6, probability: 90, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'In Production', sortOrder: 7, probability: 95, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Completed', sortOrder: 8, probability: 100, isInitial: false, isFinal: true, isWon: true, isLost: false, requiredFields: [] },
          { name: 'Lost', sortOrder: 9, probability: 0, isInitial: false, isFinal: true, isWon: false, isLost: true, requiredFields: [] },
        ],
      },
    ],
    defaultModules: ['job_costing', 'resource_scheduling', 'time_tracking', 'estimates'],
    defaultFields: [
      { fieldKey: 'project_type', label: 'Project Type', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: true, isFilterable: true, sortOrder: 1 },
      { fieldKey: 'estimated_start_date', label: 'Estimated Start Date', fieldType: CustomFieldType.DATE, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 2 },
      { fieldKey: 'estimated_duration', label: 'Estimated Duration (Days)', fieldType: CustomFieldType.NUMBER, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: false, sortOrder: 3 },
      { fieldKey: 'budget', label: 'Budget', fieldType: CustomFieldType.CURRENCY, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 4 },
    ],
    defaultActivityTypes: [
      { activityKey: 'site_visit', name: 'Site Visit', category: ActivityCategory.SITE_VISIT, isSchedulable: true, isLoggable: true, requiresLocation: true, durationDefault: 60, requiredCustomFields: [] },
      { activityKey: 'estimate', name: 'Prepare Estimate', category: ActivityCategory.ESTIMATE, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 120, requiredCustomFields: [] },
      { activityKey: 'progress_meeting', name: 'Progress Meeting', category: ActivityCategory.MEETING, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 60, requiredCustomFields: [] },
    ],
  },

  [IndustryTemplate.SALES_FOCUSED]: {
    template: IndustryTemplate.SALES_FOCUSED,
    name: 'Sales-Focused CRM',
    description: 'For businesses with account-based sales, territories, and long sales cycles',
    sectors: ['42', '52', '53'], // Wholesale, Finance, Real Estate
    focus: 'Accounts, territories, long sales cycles, commissions',
    defaultPipelines: [
      {
        name: 'Sales Pipeline',
        pipelineType: PipelineType.SALES,
        isDefault: true,
        stages: [
          { name: 'Lead', sortOrder: 1, probability: 5, isInitial: true, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Qualified', sortOrder: 2, probability: 15, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Discovery', sortOrder: 3, probability: 25, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Proposal', sortOrder: 4, probability: 50, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Negotiation', sortOrder: 5, probability: 75, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Closed Won', sortOrder: 6, probability: 100, isInitial: false, isFinal: true, isWon: true, isLost: false, requiredFields: [] },
          { name: 'Closed Lost', sortOrder: 7, probability: 0, isInitial: false, isFinal: true, isWon: false, isLost: true, requiredFields: [] },
        ],
      },
    ],
    defaultModules: ['territory_management', 'commission_tracking', 'account_hierarchies'],
    defaultFields: [
      { fieldKey: 'territory', label: 'Territory', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.ACCOUNT, isRequired: false, isSearchable: true, isFilterable: true, sortOrder: 1 },
      { fieldKey: 'account_tier', label: 'Account Tier', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.ACCOUNT, isRequired: false, isSearchable: true, isFilterable: true, sortOrder: 2 },
      { fieldKey: 'decision_makers', label: 'Decision Makers', fieldType: CustomFieldType.MULTI_SELECT, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: false, sortOrder: 3 },
      { fieldKey: 'contract_value', label: 'Contract Value', fieldType: CustomFieldType.CURRENCY, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 4 },
    ],
    defaultActivityTypes: [
      { activityKey: 'discovery_call', name: 'Discovery Call', category: ActivityCategory.CALL, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 30, requiredCustomFields: [] },
      { activityKey: 'presentation', name: 'Presentation', category: ActivityCategory.PRESENTATION, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 60, requiredCustomFields: [] },
      { activityKey: 'contract_review', name: 'Contract Review', category: ActivityCategory.MEETING, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 45, requiredCustomFields: [] },
    ],
  },

  [IndustryTemplate.SERVICE_BASED]: {
    template: IndustryTemplate.SERVICE_BASED,
    name: 'Service-Based CRM',
    description: 'For businesses that provide appointments, dispatch, and recurring services',
    sectors: ['62', '81', '56'], // Healthcare, Other Services, Admin Support
    focus: 'Appointments, dispatch, service history, recurring visits',
    defaultPipelines: [
      {
        name: 'Service Pipeline',
        pipelineType: PipelineType.SERVICE,
        isDefault: true,
        stages: [
          { name: 'Request', sortOrder: 1, probability: 20, isInitial: true, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Scheduled', sortOrder: 2, probability: 50, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'In Progress', sortOrder: 3, probability: 80, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Completed', sortOrder: 4, probability: 100, isInitial: false, isFinal: true, isWon: true, isLost: false, requiredFields: [] },
          { name: 'Follow-up', sortOrder: 5, probability: 100, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Cancelled', sortOrder: 6, probability: 0, isInitial: false, isFinal: true, isWon: false, isLost: true, requiredFields: [] },
        ],
      },
    ],
    defaultModules: ['appointment_scheduling', 'dispatch_routing', 'service_history'],
    defaultFields: [
      { fieldKey: 'service_type', label: 'Service Type', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.OPPORTUNITY, isRequired: true, isSearchable: true, isFilterable: true, sortOrder: 1 },
      { fieldKey: 'service_location', label: 'Service Location', fieldType: CustomFieldType.ADDRESS, entityType: CRMEntityType.OPPORTUNITY, isRequired: true, isSearchable: false, isFilterable: false, sortOrder: 2 },
      { fieldKey: 'duration', label: 'Duration (Minutes)', fieldType: CustomFieldType.NUMBER, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: false, sortOrder: 3 },
      { fieldKey: 'recurring_schedule', label: 'Recurring Schedule', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 4 },
    ],
    defaultActivityTypes: [
      { activityKey: 'appointment', name: 'Appointment', category: ActivityCategory.MEETING, isSchedulable: true, isLoggable: true, requiresLocation: true, durationDefault: 60, requiredCustomFields: [] },
      { activityKey: 'service_call', name: 'Service Call', category: ActivityCategory.SITE_VISIT, isSchedulable: true, isLoggable: true, requiresLocation: true, durationDefault: 60, requiredCustomFields: [] },
      { activityKey: 'follow_up', name: 'Follow-up', category: ActivityCategory.FOLLOW_UP, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 15, requiredCustomFields: [] },
    ],
  },

  [IndustryTemplate.INVENTORY_BASED]: {
    template: IndustryTemplate.INVENTORY_BASED,
    name: 'Inventory-Based CRM',
    description: 'For businesses that manage products, orders, and fulfillment',
    sectors: ['31', '32', '33', '44', '45', '11'], // Manufacturing, Retail, Agriculture
    focus: 'Products, orders, inventory, fulfillment',
    defaultPipelines: [
      {
        name: 'Order Pipeline',
        pipelineType: PipelineType.SALES,
        isDefault: true,
        stages: [
          { name: 'Quote', sortOrder: 1, probability: 20, isInitial: true, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Order Placed', sortOrder: 2, probability: 60, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Processing', sortOrder: 3, probability: 80, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Fulfillment', sortOrder: 4, probability: 90, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Shipped', sortOrder: 5, probability: 95, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Delivered', sortOrder: 6, probability: 100, isInitial: false, isFinal: true, isWon: true, isLost: false, requiredFields: [] },
          { name: 'Cancelled', sortOrder: 7, probability: 0, isInitial: false, isFinal: true, isWon: false, isLost: true, requiredFields: [] },
        ],
      },
    ],
    defaultModules: ['inventory_management', 'order_fulfillment', 'supplier_management'],
    defaultFields: [
      { fieldKey: 'order_number', label: 'Order Number', fieldType: CustomFieldType.TEXT, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: true, isFilterable: false, sortOrder: 1 },
      { fieldKey: 'ship_to_address', label: 'Ship To Address', fieldType: CustomFieldType.ADDRESS, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: false, sortOrder: 2 },
      { fieldKey: 'shipping_method', label: 'Shipping Method', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 3 },
      { fieldKey: 'tracking_number', label: 'Tracking Number', fieldType: CustomFieldType.TEXT, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: true, isFilterable: false, sortOrder: 4 },
    ],
    defaultActivityTypes: [
      { activityKey: 'order_entry', name: 'Order Entry', category: ActivityCategory.TASK, isSchedulable: false, isLoggable: true, requiresLocation: false, durationDefault: 15, requiredCustomFields: [] },
      { activityKey: 'inventory_check', name: 'Inventory Check', category: ActivityCategory.TASK, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 30, requiredCustomFields: [] },
      { activityKey: 'supplier_call', name: 'Supplier Call', category: ActivityCategory.CALL, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 20, requiredCustomFields: [] },
    ],
  },

  [IndustryTemplate.ASSET_BASED]: {
    template: IndustryTemplate.ASSET_BASED,
    name: 'Asset-Based CRM',
    description: 'For businesses that manage fleets, equipment, and maintenance',
    sectors: ['48', '49', '21', '22'], // Transportation, Mining, Utilities
    focus: 'Fleet, equipment, maintenance, compliance',
    defaultPipelines: [
      {
        name: 'Asset Lifecycle',
        pipelineType: PipelineType.PROJECT,
        isDefault: true,
        stages: [
          { name: 'Acquisition', sortOrder: 1, probability: 20, isInitial: true, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Deployment', sortOrder: 2, probability: 50, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Active', sortOrder: 3, probability: 100, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Maintenance', sortOrder: 4, probability: 80, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Decommission', sortOrder: 5, probability: 100, isInitial: false, isFinal: true, isWon: true, isLost: false, requiredFields: [] },
        ],
      },
    ],
    defaultModules: ['fleet_management', 'maintenance_scheduling', 'compliance_tracking'],
    defaultFields: [
      { fieldKey: 'asset_id', label: 'Asset ID', fieldType: CustomFieldType.TEXT, entityType: CRMEntityType.OPPORTUNITY, isRequired: true, isSearchable: true, isFilterable: false, sortOrder: 1 },
      { fieldKey: 'asset_location', label: 'Asset Location', fieldType: CustomFieldType.ADDRESS, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 2 },
      { fieldKey: 'maintenance_due', label: 'Maintenance Due', fieldType: CustomFieldType.DATE, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 3 },
      { fieldKey: 'compliance_status', label: 'Compliance Status', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 4 },
    ],
    defaultActivityTypes: [
      { activityKey: 'inspection', name: 'Inspection', category: ActivityCategory.INSPECTION, isSchedulable: true, isLoggable: true, requiresLocation: true, durationDefault: 60, requiredCustomFields: [] },
      { activityKey: 'maintenance', name: 'Maintenance', category: ActivityCategory.TASK, isSchedulable: true, isLoggable: true, requiresLocation: true, durationDefault: 120, requiredCustomFields: [] },
      { activityKey: 'compliance_audit', name: 'Compliance Audit', category: ActivityCategory.INSPECTION, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 180, requiredCustomFields: [] },
    ],
  },

  [IndustryTemplate.MEMBERSHIP_BASED]: {
    template: IndustryTemplate.MEMBERSHIP_BASED,
    name: 'Membership-Based CRM',
    description: 'For businesses that manage members, enrollment, and programs',
    sectors: ['61', '71'], // Education, Arts & Entertainment
    focus: 'Members, enrollment, progress, events',
    defaultPipelines: [
      {
        name: 'Enrollment Pipeline',
        pipelineType: PipelineType.ONBOARDING,
        isDefault: true,
        stages: [
          { name: 'Prospect', sortOrder: 1, probability: 10, isInitial: true, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Applied', sortOrder: 2, probability: 30, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Enrolled', sortOrder: 3, probability: 80, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Active', sortOrder: 4, probability: 100, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Renewal', sortOrder: 5, probability: 70, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Alumni', sortOrder: 6, probability: 100, isInitial: false, isFinal: true, isWon: true, isLost: false, requiredFields: [] },
          { name: 'Withdrawn', sortOrder: 7, probability: 0, isInitial: false, isFinal: true, isWon: false, isLost: true, requiredFields: [] },
        ],
      },
    ],
    defaultModules: ['enrollment', 'member_portal', 'progress_tracking', 'events'],
    defaultFields: [
      { fieldKey: 'member_id', label: 'Member ID', fieldType: CustomFieldType.TEXT, entityType: CRMEntityType.CONTACT, isRequired: false, isSearchable: true, isFilterable: false, sortOrder: 1 },
      { fieldKey: 'enrollment_date', label: 'Enrollment Date', fieldType: CustomFieldType.DATE, entityType: CRMEntityType.CONTACT, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 2 },
      { fieldKey: 'membership_tier', label: 'Membership Tier', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.CONTACT, isRequired: false, isSearchable: true, isFilterable: true, sortOrder: 3 },
      { fieldKey: 'expiration_date', label: 'Expiration Date', fieldType: CustomFieldType.DATE, entityType: CRMEntityType.CONTACT, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 4 },
    ],
    defaultActivityTypes: [
      { activityKey: 'registration', name: 'Registration', category: ActivityCategory.TASK, isSchedulable: false, isLoggable: true, requiresLocation: false, durationDefault: 30, requiredCustomFields: [] },
      { activityKey: 'class_session', name: 'Class/Session', category: ActivityCategory.MEETING, isSchedulable: true, isLoggable: true, requiresLocation: true, durationDefault: 60, requiredCustomFields: [] },
      { activityKey: 'event', name: 'Event', category: ActivityCategory.MEETING, isSchedulable: true, isLoggable: true, requiresLocation: true, durationDefault: 120, requiredCustomFields: [] },
    ],
  },

  [IndustryTemplate.HOSPITALITY_BASED]: {
    template: IndustryTemplate.HOSPITALITY_BASED,
    name: 'Hospitality-Based CRM',
    description: 'For businesses that manage reservations, capacity, and guest experience',
    sectors: ['72'], // Accommodation & Food
    focus: 'Reservations, capacity, guest experience',
    defaultPipelines: [
      {
        name: 'Reservation Pipeline',
        pipelineType: PipelineType.SERVICE,
        isDefault: true,
        stages: [
          { name: 'Inquiry', sortOrder: 1, probability: 20, isInitial: true, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Reserved', sortOrder: 2, probability: 70, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Confirmed', sortOrder: 3, probability: 90, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Checked In', sortOrder: 4, probability: 100, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Completed', sortOrder: 5, probability: 100, isInitial: false, isFinal: true, isWon: true, isLost: false, requiredFields: [] },
          { name: 'Cancelled', sortOrder: 6, probability: 0, isInitial: false, isFinal: true, isWon: false, isLost: true, requiredFields: [] },
          { name: 'No Show', sortOrder: 7, probability: 0, isInitial: false, isFinal: true, isWon: false, isLost: true, requiredFields: [] },
        ],
      },
    ],
    defaultModules: ['reservations', 'table_room_management', 'guest_profiles'],
    defaultFields: [
      { fieldKey: 'party_size', label: 'Party Size', fieldType: CustomFieldType.NUMBER, entityType: CRMEntityType.OPPORTUNITY, isRequired: true, isSearchable: false, isFilterable: true, sortOrder: 1 },
      { fieldKey: 'reservation_datetime', label: 'Reservation Date/Time', fieldType: CustomFieldType.DATETIME, entityType: CRMEntityType.OPPORTUNITY, isRequired: true, isSearchable: false, isFilterable: true, sortOrder: 2 },
      { fieldKey: 'room_table', label: 'Room/Table', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 3 },
      { fieldKey: 'special_requests', label: 'Special Requests', fieldType: CustomFieldType.TEXTAREA, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: false, sortOrder: 4 },
      { fieldKey: 'vip_status', label: 'VIP Status', fieldType: CustomFieldType.BOOLEAN, entityType: CRMEntityType.CONTACT, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 5 },
    ],
    defaultActivityTypes: [
      { activityKey: 'reservation', name: 'Reservation', category: ActivityCategory.TASK, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 15, requiredCustomFields: [] },
      { activityKey: 'check_in', name: 'Check In', category: ActivityCategory.TASK, isSchedulable: false, isLoggable: true, requiresLocation: true, durationDefault: 10, requiredCustomFields: [] },
      { activityKey: 'guest_feedback', name: 'Guest Feedback', category: ActivityCategory.NOTE, isSchedulable: false, isLoggable: true, requiresLocation: false, durationDefault: 5, requiredCustomFields: [] },
    ],
  },

  [IndustryTemplate.CASE_BASED]: {
    template: IndustryTemplate.CASE_BASED,
    name: 'Case-Based CRM',
    description: 'For businesses that manage cases, requests, and compliance',
    sectors: ['92', '55'], // Public Administration, Management of Companies
    focus: 'Cases, requests, compliance, documentation',
    defaultPipelines: [
      {
        name: 'Case Pipeline',
        pipelineType: PipelineType.SUPPORT,
        isDefault: true,
        stages: [
          { name: 'Submitted', sortOrder: 1, probability: 10, isInitial: true, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Under Review', sortOrder: 2, probability: 30, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'In Progress', sortOrder: 3, probability: 60, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Pending Approval', sortOrder: 4, probability: 80, isInitial: false, isFinal: false, isWon: false, isLost: false, requiredFields: [] },
          { name: 'Resolved', sortOrder: 5, probability: 100, isInitial: false, isFinal: true, isWon: true, isLost: false, requiredFields: [] },
          { name: 'Closed', sortOrder: 6, probability: 100, isInitial: false, isFinal: true, isWon: true, isLost: false, requiredFields: [] },
          { name: 'Rejected', sortOrder: 7, probability: 0, isInitial: false, isFinal: true, isWon: false, isLost: true, requiredFields: [] },
        ],
      },
    ],
    defaultModules: ['case_management', 'request_tracking', 'compliance_audit'],
    defaultFields: [
      { fieldKey: 'case_number', label: 'Case Number', fieldType: CustomFieldType.TEXT, entityType: CRMEntityType.OPPORTUNITY, isRequired: true, isSearchable: true, isFilterable: false, sortOrder: 1 },
      { fieldKey: 'case_category', label: 'Category', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.OPPORTUNITY, isRequired: true, isSearchable: true, isFilterable: true, sortOrder: 2 },
      { fieldKey: 'priority', label: 'Priority', fieldType: CustomFieldType.SELECT, entityType: CRMEntityType.OPPORTUNITY, isRequired: true, isSearchable: false, isFilterable: true, sortOrder: 3 },
      { fieldKey: 'assigned_to', label: 'Assigned To', fieldType: CustomFieldType.USER_REFERENCE, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: true, sortOrder: 4 },
      { fieldKey: 'resolution', label: 'Resolution', fieldType: CustomFieldType.TEXTAREA, entityType: CRMEntityType.OPPORTUNITY, isRequired: false, isSearchable: false, isFilterable: false, sortOrder: 5 },
    ],
    defaultActivityTypes: [
      { activityKey: 'case_update', name: 'Case Update', category: ActivityCategory.NOTE, isSchedulable: false, isLoggable: true, requiresLocation: false, durationDefault: 15, requiredCustomFields: [] },
      { activityKey: 'review_meeting', name: 'Review Meeting', category: ActivityCategory.MEETING, isSchedulable: true, isLoggable: true, requiresLocation: false, durationDefault: 60, requiredCustomFields: [] },
      { activityKey: 'approval', name: 'Approval', category: ActivityCategory.TASK, isSchedulable: false, isLoggable: true, requiresLocation: false, durationDefault: 30, requiredCustomFields: [] },
    ],
  },
};

/**
 * Get the appropriate template for a NAICS sector code
 */
export function getTemplateForSector(sectorCode: string): IndustryTemplate {
  const sectorTemplateMap: Record<string, IndustryTemplate> = {
    '11': IndustryTemplate.INVENTORY_BASED,    // Agriculture
    '21': IndustryTemplate.ASSET_BASED,        // Mining
    '22': IndustryTemplate.ASSET_BASED,        // Utilities
    '23': IndustryTemplate.PROJECT_BASED,      // Construction
    '31': IndustryTemplate.INVENTORY_BASED,    // Manufacturing
    '32': IndustryTemplate.INVENTORY_BASED,    // Manufacturing
    '33': IndustryTemplate.INVENTORY_BASED,    // Manufacturing
    '42': IndustryTemplate.SALES_FOCUSED,      // Wholesale Trade
    '44': IndustryTemplate.INVENTORY_BASED,    // Retail Trade
    '45': IndustryTemplate.INVENTORY_BASED,    // Retail Trade
    '48': IndustryTemplate.ASSET_BASED,        // Transportation
    '49': IndustryTemplate.ASSET_BASED,        // Warehousing
    '51': IndustryTemplate.PROJECT_BASED,      // Information
    '52': IndustryTemplate.SALES_FOCUSED,      // Finance & Insurance
    '53': IndustryTemplate.SALES_FOCUSED,      // Real Estate
    '54': IndustryTemplate.PROJECT_BASED,      // Professional Services
    '55': IndustryTemplate.CASE_BASED,         // Management of Companies
    '56': IndustryTemplate.SERVICE_BASED,      // Admin & Support
    '61': IndustryTemplate.MEMBERSHIP_BASED,   // Education
    '62': IndustryTemplate.SERVICE_BASED,      // Healthcare
    '71': IndustryTemplate.MEMBERSHIP_BASED,   // Arts & Entertainment
    '72': IndustryTemplate.HOSPITALITY_BASED,  // Accommodation & Food
    '81': IndustryTemplate.SERVICE_BASED,      // Other Services
    '92': IndustryTemplate.CASE_BASED,         // Public Administration
  };

  return sectorTemplateMap[sectorCode] || IndustryTemplate.SALES_FOCUSED;
}
