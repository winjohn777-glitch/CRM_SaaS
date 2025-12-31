'use client';

import { useState } from 'react';
import { ContactCard, Button, Modal, Input, Select } from '@crm/ui';
import type { CRMContact, ContactStatus } from '@crm/types';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';

// Mock contacts data
const mockContacts: CRMContact[] = [
  {
    id: '1',
    tenantId: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    mobile: '(555) 987-6543',
    title: 'Property Manager',
    status: 'CUSTOMER',
    source: 'Referral',
    accountId: '1',
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    tenantId: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@company.com',
    phone: '(555) 234-5678',
    title: 'Homeowner',
    status: 'PROSPECT',
    source: 'Website',
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    tenantId: '1',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'mbrown@business.com',
    phone: '(555) 345-6789',
    title: 'Facilities Director',
    status: 'ACTIVE',
    source: 'Trade Show',
    accountId: '2',
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    tenantId: '1',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@corp.com',
    phone: '(555) 456-7890',
    title: 'Building Manager',
    status: 'CUSTOMER',
    source: 'Google',
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<CRMContact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchQuery === '' ||
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone?.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PROSPECT', label: 'Prospect' },
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500">
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
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
            Add Contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex-1">
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          className="w-40"
        />
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
          More Filters
        </Button>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onClick={() => setSelectedContact(contact)}
            onEdit={() => setSelectedContact(contact)}
            onDelete={() => {
              if (confirm('Are you sure you want to delete this contact?')) {
                setContacts((prev) => prev.filter((c) => c.id !== contact.id));
              }
            }}
          />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">No contacts found</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create your first contact
          </Button>
        </div>
      )}

      {/* Create Contact Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Contact"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required placeholder="John" />
            <Input label="Last Name" required placeholder="Smith" />
          </div>
          <Input label="Email" type="email" placeholder="john@example.com" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" type="tel" placeholder="(555) 123-4567" />
            <Input label="Mobile" type="tel" placeholder="(555) 987-6543" />
          </div>
          <Input label="Title" placeholder="Property Manager" />
          <Select
            label="Status"
            options={statusOptions.filter((o) => o.value !== 'all')}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Contact</Button>
          </div>
        </form>
      </Modal>

      {/* Contact Detail Modal */}
      <Modal
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title={selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : ''}
        size="lg"
      >
        {selectedContact && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedContact.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedContact.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium">{selectedContact.title || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{selectedContact.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="font-medium">{selectedContact.source || '-'}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedContact(null)}>
                Close
              </Button>
              <Button>Edit Contact</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
