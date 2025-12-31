'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CRMConfigProvider, CRMSidebar, CRMHeader } from '@crm/ui';
import { configurationRegistry } from '@crm/config';

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Get default configuration (would come from user's tenant in real app)
  const configuration = configurationRegistry.getConfiguration('238160'); // Roofing

  const handleNavigate = (href: string) => {
    router.push(href);
    setMobileSidebarOpen(false);
  };

  // Mock user
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  // Get page title from path
  const getPageTitle = () => {
    const path = pathname.replace('/crm', '').replace('/', '');
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <CRMConfigProvider initialConfig={configuration}>
      <div className="h-screen flex bg-gray-50">
        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform lg:transform-none ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <CRMSidebar
            currentPath={pathname}
            onNavigate={handleNavigate}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <CRMHeader
            title={getPageTitle()}
            user={user}
            onSearch={(query) => console.log('Search:', query)}
            onMenuClick={() => setMobileSidebarOpen(true)}
          />

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </CRMConfigProvider>
  );
}
