'use client';

import { useState } from 'react';
import { AccountCard, Button, Modal, Input, Select } from '@crm/ui';
import type { CRMAccount, AccountType } from '@crm/types';
import { Plus, Search, Filter, Download, Upload, Building2 } from 'lucide-react';

// Mock accounts data
const mockAccounts: CRMAccount[] = [
  {
    id: '1',
    tenantId: '1',
    name: 'Sunrise Property Management',
    website: 'https://sunrisepm.com',
    industry: 'Real Estate',
    employeeCount: '50-100',
    annualRevenue: '$5M-$10M',
    accountType: 'CUSTOMER',
    address: {
      street: '123 Main St',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
    },
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    tenantId: '1',
    name: 'Commercial Plaza Inc',
    website: 'https://commercialplaza.com',
    industry: 'Commercial Real Estate',
    employeeCount: '100-250',
    annualRevenue: '$10M-$25M',
    accountType: 'PROSPECT',
    address: {
      street: '456 Business Ave',
      city: 'Fort Lauderdale',
      state: 'FL',
      zip: '33301',
    },
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    tenantId: '1',
    name: 'Oakwood Homeowners Association',
    website: 'https://oakwoodhoa.org',
    industry: 'HOA',
    employeeCount: '1-10',
    annualRevenue: '$500K-$1M',
    accountType: 'CUSTOMER',
    address: {
      street: '789 Oak Lane',
      city: 'Tampa',
      state: 'FL',
      zip: '33601',
    },
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    tenantId: '1',
    name: 'Metro Development Group',
    website: 'https://metrodev.com',
    industry: 'Construction',
    employeeCount: '250-500',
    annualRevenue: '$50M-$100M',
    accountType: 'PARTNER',
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<CRMAccount[]>(mockAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<CRMAccount | null>(null);

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      searchQuery === '' ||
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.website?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.industry?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === 'all' || account.accountType === typeFilter;

    return matchesSearch && matchesType;
  });

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'PROSPECT', label: 'Prospect' },
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'PARTNER', label: 'Partner' },
    { value: 'VENDOR', label: 'Vendor' },
    { value: 'COMPETITOR', label: 'Competitor' },
  ];

  const getTypeColor = (type: AccountType) => {
    const colors: Record<AccountType, string> = {
      PROSPECT: 'bg-yellow-100 text-yellow-800',
      CUSTOMER: 'bg-green-100 text-green-800',
      PARTNER: 'bg-blue-100 text-blue-800',
      VENDOR: 'bg-purple-100 text-purple-800',
      COMPETITOR: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-sm text-gray-500">
            {filteredAccounts.length} account{filteredAccounts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
            Import
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Account
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex-1">
          <Input
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={typeOptions}
          className="w-40"
        />
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
          More Filters
        </Button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((account) => (
          <div
            key={account.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedAccount(account)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-500">{account.industry}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(account.accountType)}`}>
                {account.accountType}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              {account.website && (
                <p className="text-gray-600">{account.website}</p>
              )}
              {account.address && (
                <p className="text-gray-500">
                  {account.address.city}, {account.address.state}
                </p>
              )}
              {account.employeeCount && (
                <p className="text-gray-500">{account.employeeCount} employees</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No accounts found</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create your first account
          </Button>
        </div>
      )}

      {/* Create Account Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Account"
        size="lg"
      >
        <form className="space-y-4">
          <Input label="Account Name" required placeholder="Acme Corporation" />
          <Input label="Website" type="url" placeholder="https://acme.com" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Industry" placeholder="Construction" />
            <Select
              label="Account Type"
              options={typeOptions.filter((o) => o.value !== 'all')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Employee Count" placeholder="50-100" />
            <Input label="Annual Revenue" placeholder="$1M-$5M" />
          </div>
          <Input label="Street Address" placeholder="123 Main St" />
          <div className="grid grid-cols-3 gap-4">
            <Input label="City" placeholder="Miami" />
            <Input label="State" placeholder="FL" />
            <Input label="ZIP" placeholder="33101" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </Modal>

      {/* Account Detail Modal */}
      <Modal
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
        title={selectedAccount?.name || ''}
        size="lg"
      >
        {selectedAccount && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="font-medium">{selectedAccount.website || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium">{selectedAccount.industry || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedAccount.accountType)}`}>
                  {selectedAccount.accountType}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employee Count</p>
                <p className="font-medium">{selectedAccount.employeeCount || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Annual Revenue</p>
                <p className="font-medium">{selectedAccount.annualRevenue || '-'}</p>
              </div>
              {selectedAccount.address && (
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">
                    {selectedAccount.address.street}<br />
                    {selectedAccount.address.city}, {selectedAccount.address.state} {selectedAccount.address.zip}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedAccount(null)}>
                Close
              </Button>
              <Button>Edit Account</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
