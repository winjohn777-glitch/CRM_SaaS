'use client';

import { useState } from 'react';
import { PipelineBoard, Button, Modal, Input, Select, useCRMConfig } from '@crm/ui';
import type { CRMOpportunity } from '@crm/types';
import { Plus } from 'lucide-react';

// Mock opportunities data
const mockOpportunities: CRMOpportunity[] = [
  {
    id: '1',
    tenantId: '1',
    name: 'Smith Residence Roof Replacement',
    amount: 15000,
    probability: 70,
    expectedCloseDate: new Date('2024-02-15'),
    pipelineId: '1',
    stageId: 'stage-3', // Estimate Prepared
    accountId: '1',
    contactId: '1',
    status: 'OPEN',
    customFields: { project_type: 'new_construction', roof_type: 'asphalt_shingle' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    tenantId: '1',
    name: 'Johnson Commercial Roofing',
    amount: 85000,
    probability: 90,
    expectedCloseDate: new Date('2024-01-30'),
    pipelineId: '1',
    stageId: 'stage-6', // Contract Signed
    accountId: '2',
    status: 'OPEN',
    customFields: { project_type: 'renovation', roof_type: 'metal' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    tenantId: '1',
    name: 'ABC Corp Storm Damage Repair',
    amount: 45000,
    probability: 50,
    expectedCloseDate: new Date('2024-02-28'),
    pipelineId: '1',
    stageId: 'stage-4', // Proposal Sent
    accountId: '3',
    status: 'OPEN',
    customFields: { project_type: 'repair', damage_type: ['storm', 'hail'] },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    tenantId: '1',
    name: 'Williams Property Inspection',
    amount: 12000,
    probability: 20,
    pipelineId: '1',
    stageId: 'stage-2', // Site Visit Scheduled
    status: 'OPEN',
    customFields: { project_type: 'maintenance' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    tenantId: '1',
    name: 'New Lead - Brown Residence',
    amount: 8000,
    probability: 10,
    pipelineId: '1',
    stageId: 'stage-1', // Lead
    status: 'OPEN',
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function OpportunitiesPage() {
  const { pipelines } = useCRMConfig();
  const [opportunities, setOpportunities] = useState<CRMOpportunity[]>(mockOpportunities);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<CRMOpportunity | null>(null);
  const [createStageId, setCreateStageId] = useState<string | undefined>();

  // Map stage names to IDs based on configuration
  const getOpportunitiesWithMappedStages = () => {
    const pipeline = pipelines[0];
    if (!pipeline) return opportunities;

    return opportunities.map((opp) => {
      // Map mock stage IDs to actual config stage IDs
      const stageIndex = parseInt(opp.stageId.replace('stage-', '')) - 1;
      const stage = pipeline.stages[stageIndex];
      return {
        ...opp,
        stageId: stage?.id || opp.stageId,
      };
    });
  };

  const handleOpportunityMove = (opportunityId: string, newStageId: string) => {
    const pipeline = pipelines[0];
    const stage = pipeline?.stages.find((s) => s.id === newStageId);

    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === opportunityId
          ? { ...opp, stageId: newStageId, probability: stage?.probability ?? opp.probability }
          : opp
      )
    );
  };

  const handleCreateOpportunity = (stageId?: string) => {
    setCreateStageId(stageId);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-sm text-gray-500">
            {opportunities.filter((o) => o.status === 'OPEN').length} open opportunities
          </p>
        </div>
        <Button
          onClick={() => handleCreateOpportunity()}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Opportunity
        </Button>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 min-h-0">
        <PipelineBoard
          pipelineType="SALES"
          opportunities={getOpportunitiesWithMappedStages()}
          onOpportunityClick={(opp) => setSelectedOpportunity(opp)}
          onOpportunityMove={handleOpportunityMove}
          onCreateOpportunity={handleCreateOpportunity}
        />
      </div>

      {/* Create Opportunity Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateStageId(undefined);
        }}
        title="Add New Opportunity"
        size="lg"
      >
        <form className="space-y-4">
          <Input label="Opportunity Name" required placeholder="Smith Residence Roof Replacement" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount" type="number" placeholder="15000" leftAddon={<span className="text-gray-400">$</span>} />
            <Input label="Probability" type="number" placeholder="70" rightAddon={<span className="text-gray-400">%</span>} />
          </div>
          <Input label="Expected Close Date" type="date" />
          <Select
            label="Stage"
            options={
              pipelines[0]?.stages.map((s) => ({ value: s.id || '', label: s.name })) || []
            }
            value={createStageId}
          />
          <Select
            label="Project Type"
            options={[
              { value: 'new_construction', label: 'New Construction' },
              { value: 'renovation', label: 'Renovation' },
              { value: 'repair', label: 'Repair' },
              { value: 'maintenance', label: 'Maintenance' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Opportunity</Button>
          </div>
        </form>
      </Modal>

      {/* Opportunity Detail Modal */}
      <Modal
        isOpen={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        title={selectedOpportunity?.name || ''}
        size="lg"
      >
        {selectedOpportunity && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-xl">
                  ${Number(selectedOpportunity.amount || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Probability</p>
                <p className="font-medium text-xl">{selectedOpportunity.probability}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Close</p>
                <p className="font-medium">
                  {selectedOpportunity.expectedCloseDate
                    ? new Date(selectedOpportunity.expectedCloseDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{selectedOpportunity.status}</p>
              </div>
            </div>

            {selectedOpportunity.customFields && Object.keys(selectedOpportunity.customFields).length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Custom Fields</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedOpportunity.customFields).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-gray-500">{key.replace(/_/g, ' ')}</p>
                      <p className="font-medium">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setSelectedOpportunity(null)}
              >
                Close
              </Button>
              <Button variant="success">Mark as Won</Button>
              <Button>Edit Opportunity</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
