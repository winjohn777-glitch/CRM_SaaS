'use client';

import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../core/Button';
import {
  Search,
  Bell,
  HelpCircle,
  User,
  ChevronDown,
  Plus,
  Menu,
} from 'lucide-react';

export interface CRMHeaderProps {
  title?: string;
  subtitle?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSearch?: (query: string) => void;
  onCreateClick?: () => void;
  createLabel?: string;
  onMenuClick?: () => void;
  showSearch?: boolean;
  showNotifications?: boolean;
  showHelp?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function CRMHeader({
  title,
  subtitle,
  user,
  onSearch,
  onCreateClick,
  createLabel = 'Create',
  onMenuClick,
  showSearch = true,
  showNotifications = true,
  showHelp = true,
  actions,
  className,
}: CRMHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header
      className={cn(
        'h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4',
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </button>
        )}

        {(title || subtitle) && (
          <div>
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Center Section - Search */}
      {showSearch && onSearch && (
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts, accounts, opportunities..."
              className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <kbd className="hidden lg:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 rounded border border-gray-200">
              ⌘K
            </kbd>
          </div>
        </form>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {actions}

        {onCreateClick && (
          <Button
            onClick={onCreateClick}
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            {createLabel}
          </Button>
        )}

        {showHelp && (
          <button
            type="button"
            className="p-2 rounded-md hover:bg-gray-100"
            title="Help"
          >
            <HelpCircle className="h-5 w-5 text-gray-400" />
          </button>
        )}

        {showNotifications && (
          <button
            type="button"
            className="relative p-2 rounded-md hover:bg-gray-100"
            title="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        )}

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  {user.name[0].toUpperCase()}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-400" />
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile Settings
                    </button>
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Account Settings
                    </button>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
