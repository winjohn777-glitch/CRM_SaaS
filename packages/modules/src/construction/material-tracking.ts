import { CRMEntityType } from '@crm/types';
import type { ModuleContext, ModuleRoute, ModulePermission, ModuleSettingDefinition } from '@crm/types';
import { BaseModule } from '../base';

/**
 * Material Tracking Module
 *
 * Provides material management and inventory tracking for construction companies.
 * Track materials, orders, and usage per job.
 */
export class MaterialTrackingModule extends BaseModule {
  key = 'material_tracking';
  name = 'Material Tracking';
  description = 'Track materials, orders, and inventory with supplier management';
  version = '1.0.0';
  author = 'CRM SaaS';

  routeBase = '/materials';

  naicsRequirements = {
    sectors: ['23'], // Construction
    templates: ['PROJECT_BASED'],
  };

  requires = ['job_costing']; // Depends on job costing module

  routes: ModuleRoute[] = [
    { path: '/', method: 'GET', handler: 'listMaterials' },
    { path: '/:id', method: 'GET', handler: 'getMaterial' },
    { path: '/', method: 'POST', handler: 'createMaterial', permissions: ['material_tracking:create'] },
    { path: '/:id', method: 'PUT', handler: 'updateMaterial', permissions: ['material_tracking:update'] },
    { path: '/:id', method: 'DELETE', handler: 'deleteMaterial', permissions: ['material_tracking:delete'] },
    { path: '/categories', method: 'GET', handler: 'getCategories' },
    { path: '/orders', method: 'GET', handler: 'listOrders' },
    { path: '/orders/:id', method: 'GET', handler: 'getOrder' },
    { path: '/orders', method: 'POST', handler: 'createOrder', permissions: ['material_tracking:order'] },
    { path: '/orders/:id', method: 'PUT', handler: 'updateOrder', permissions: ['material_tracking:order'] },
    { path: '/orders/:id/receive', method: 'POST', handler: 'receiveOrder', permissions: ['material_tracking:receive'] },
    { path: '/job/:jobId', method: 'GET', handler: 'getJobMaterials' },
    { path: '/job/:jobId', method: 'POST', handler: 'addJobMaterial', permissions: ['material_tracking:assign'] },
    { path: '/inventory', method: 'GET', handler: 'getInventory' },
    { path: '/inventory/low-stock', method: 'GET', handler: 'getLowStock' },
    { path: '/suppliers', method: 'GET', handler: 'listSuppliers' },
    { path: '/suppliers/:id', method: 'GET', handler: 'getSupplier' },
    { path: '/suppliers', method: 'POST', handler: 'createSupplier', permissions: ['material_tracking:suppliers'] },
    { path: '/reports/usage', method: 'GET', handler: 'getUsageReport' },
    { path: '/reports/costs', method: 'GET', handler: 'getCostReport' },
  ];

  navigation = {
    mainNav: {
      label: 'Materials',
      icon: 'package',
      path: '/materials',
      order: 30,
      children: [
        { label: 'Catalog', icon: 'list', path: '/materials' },
        { label: 'Orders', icon: 'shopping-cart', path: '/materials/orders' },
        { label: 'Inventory', icon: 'archive', path: '/materials/inventory' },
        { label: 'Suppliers', icon: 'truck', path: '/materials/suppliers' },
      ],
    },
    settingsNav: {
      label: 'Material Settings',
      icon: 'settings',
      path: '/settings/materials',
    },
    entityTabs: [
      {
        entityType: CRMEntityType.OPPORTUNITY,
        label: 'Materials',
        path: 'materials',
        order: 3,
      },
    ],
  };

  permissions: ModulePermission[] = [
    {
      key: 'material_tracking:view',
      name: 'View Materials',
      description: 'View material catalog and inventory',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER'],
    },
    {
      key: 'material_tracking:create',
      name: 'Create Materials',
      description: 'Add new materials to catalog',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
    {
      key: 'material_tracking:update',
      name: 'Update Materials',
      description: 'Edit material details and pricing',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
    {
      key: 'material_tracking:delete',
      name: 'Delete Materials',
      description: 'Remove materials from catalog',
      defaultRoles: ['OWNER', 'ADMIN'],
    },
    {
      key: 'material_tracking:order',
      name: 'Create Orders',
      description: 'Create and manage material orders',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
    {
      key: 'material_tracking:receive',
      name: 'Receive Orders',
      description: 'Mark orders as received and update inventory',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER'],
    },
    {
      key: 'material_tracking:assign',
      name: 'Assign Materials',
      description: 'Assign materials to jobs',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER'],
    },
    {
      key: 'material_tracking:suppliers',
      name: 'Manage Suppliers',
      description: 'Add and edit suppliers',
      defaultRoles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
  ];

  settings: ModuleSettingDefinition[] = [
    {
      key: 'default_markup',
      label: 'Default Material Markup (%)',
      description: 'Default markup percentage for materials',
      type: 'number',
      defaultValue: 15,
      validation: { min: 0, max: 100 },
    },
    {
      key: 'low_stock_threshold',
      label: 'Low Stock Threshold',
      description: 'Quantity threshold for low stock alerts',
      type: 'number',
      defaultValue: 10,
      validation: { min: 0 },
    },
    {
      key: 'enable_low_stock_alerts',
      label: 'Enable Low Stock Alerts',
      description: 'Send notifications when materials are low',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'track_inventory',
      label: 'Track Inventory',
      description: 'Enable inventory tracking for materials',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'default_unit',
      label: 'Default Unit of Measure',
      description: 'Default unit for new materials',
      type: 'select',
      defaultValue: 'each',
      options: [
        { value: 'each', label: 'Each' },
        { value: 'box', label: 'Box' },
        { value: 'bundle', label: 'Bundle' },
        { value: 'roll', label: 'Roll' },
        { value: 'sq_ft', label: 'Square Feet' },
        { value: 'linear_ft', label: 'Linear Feet' },
        { value: 'lb', label: 'Pound' },
        { value: 'gallon', label: 'Gallon' },
      ],
    },
    {
      key: 'require_po_number',
      label: 'Require PO Number',
      description: 'Require purchase order number for orders',
      type: 'boolean',
      defaultValue: false,
    },
  ];

  override async onActivate(context: ModuleContext): Promise<void> {
    console.log(`Material Tracking module activated for tenant ${context.tenantId}`);
  }

  override async onDeactivate(context: ModuleContext): Promise<void> {
    console.log(`Material Tracking module deactivated for tenant ${context.tenantId}`);
  }
}

export const materialTrackingModule = new MaterialTrackingModule();
