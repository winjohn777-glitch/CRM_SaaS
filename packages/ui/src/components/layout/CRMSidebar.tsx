'use client';

import React from 'react';
import { useCRMConfig } from '../../contexts/CRMConfigContext';
import { useModules } from '../../hooks/useModules';
import { cn } from '../../utils/cn';
import {
  Users,
  Building2,
  Target,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Home,
  ChevronRight,
  Package,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  featureKey?: string;
  moduleKey?: string;
  badge?: string | number;
}

const defaultNavItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/crm', icon: Home },
  { key: 'contacts', label: 'Contacts', href: '/crm/contacts', icon: Users, featureKey: 'contacts' },
  { key: 'accounts', label: 'Accounts', href: '/crm/accounts', icon: Building2, featureKey: 'accounts' },
  { key: 'opportunities', label: 'Opportunities', href: '/crm/opportunities', icon: Target, featureKey: 'opportunities' },
  { key: 'activities', label: 'Activities', href: '/crm/activities', icon: Calendar, featureKey: 'activities' },
  { key: 'documents', label: 'Documents', href: '/crm/documents', icon: FileText, featureKey: 'documents' },
  { key: 'reports', label: 'Reports', href: '/crm/reports', icon: BarChart3, featureKey: 'reports' },
];

export interface CRMSidebarProps {
  currentPath: string;
  onNavigate: (href: string) => void;
  additionalItems?: NavItem[];
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function CRMSidebar({
  currentPath,
  onNavigate,
  additionalItems = [],
  className,
  collapsed = false,
  onToggleCollapse,
}: CRMSidebarProps) {
  const { isFeatureEnabled, currentTemplate } = useCRMConfig();
  const { enabledModules, getModuleConfig } = useModules();

  // Filter nav items based on enabled features
  const visibleNavItems = defaultNavItems.filter((item) => {
    if (!item.featureKey) return true;
    return isFeatureEnabled(item.featureKey);
  });

  // Generate module nav items
  const moduleNavItems: NavItem[] = enabledModules
    .map((m) => {
      const config = getModuleConfig(m.moduleKey);
      if (!config?.routeBase) return null;
      return {
        key: m.moduleKey,
        label: config.name,
        href: config.routeBase,
        icon: Package,
        moduleKey: m.moduleKey,
      };
    })
    .filter(Boolean) as NavItem[];

  const allNavItems = [...visibleNavItems, ...moduleNavItems, ...additionalItems];

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-white border-r border-gray-200 transition-all',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <div>
            <h1 className="font-semibold text-gray-900">CRM</h1>
            {currentTemplate && (
              <p className="text-xs text-gray-500 truncate">{currentTemplate}</p>
            )}
          </div>
        )}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronRight
              className={cn(
                'h-5 w-5 text-gray-400 transition-transform',
                !collapsed && 'rotate-180'
              )}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {allNavItems.map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.href)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-blue-600' : 'text-gray-400')} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        {moduleNavItems.length > 0 && (
          <div className="my-4 px-4">
            <div className="border-t border-gray-200" />
            {!collapsed && (
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-4 px-2">
                Modules
              </p>
            )}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-2">
        <button
          type="button"
          onClick={() => onNavigate('/crm/settings')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors',
            currentPath.startsWith('/crm/settings') && 'bg-gray-100'
          )}
        >
          <Settings className="h-5 w-5 text-gray-400" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
