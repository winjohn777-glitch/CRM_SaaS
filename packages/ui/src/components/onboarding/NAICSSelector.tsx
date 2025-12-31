'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '../core/Input';
import { cn } from '../../utils/cn';
import { Search, ChevronRight, Check, Building2 } from 'lucide-react';

// NAICS Sector definitions
const naicsSectors = [
  { code: '11', name: 'Agriculture, Forestry, Fishing and Hunting' },
  { code: '21', name: 'Mining, Quarrying, and Oil and Gas Extraction' },
  { code: '22', name: 'Utilities' },
  { code: '23', name: 'Construction' },
  { code: '31-33', name: 'Manufacturing' },
  { code: '42', name: 'Wholesale Trade' },
  { code: '44-45', name: 'Retail Trade' },
  { code: '48-49', name: 'Transportation and Warehousing' },
  { code: '51', name: 'Information' },
  { code: '52', name: 'Finance and Insurance' },
  { code: '53', name: 'Real Estate and Rental and Leasing' },
  { code: '54', name: 'Professional, Scientific, and Technical Services' },
  { code: '55', name: 'Management of Companies and Enterprises' },
  { code: '56', name: 'Administrative and Support and Waste Management' },
  { code: '61', name: 'Educational Services' },
  { code: '62', name: 'Health Care and Social Assistance' },
  { code: '71', name: 'Arts, Entertainment, and Recreation' },
  { code: '72', name: 'Accommodation and Food Services' },
  { code: '81', name: 'Other Services (except Public Administration)' },
  { code: '92', name: 'Public Administration' },
];

// Sample subsectors for Construction (23)
const constructionSubsectors = [
  { code: '236', name: 'Construction of Buildings' },
  { code: '237', name: 'Heavy and Civil Engineering Construction' },
  { code: '238', name: 'Specialty Trade Contractors' },
];

// Sample industries for Specialty Trade (238)
const specialtyTradeIndustries = [
  { code: '238110', name: 'Poured Concrete Foundation and Structure Contractors' },
  { code: '238120', name: 'Structural Steel and Precast Concrete Contractors' },
  { code: '238130', name: 'Framing Contractors' },
  { code: '238140', name: 'Masonry Contractors' },
  { code: '238150', name: 'Glass and Glazing Contractors' },
  { code: '238160', name: 'Roofing Contractors' },
  { code: '238170', name: 'Siding Contractors' },
  { code: '238190', name: 'Other Foundation, Structure, and Building Exterior Contractors' },
  { code: '238210', name: 'Electrical Contractors' },
  { code: '238220', name: 'Plumbing, Heating, and Air-Conditioning Contractors' },
  { code: '238290', name: 'Other Building Equipment Contractors' },
  { code: '238310', name: 'Drywall and Insulation Contractors' },
  { code: '238320', name: 'Painting and Wall Covering Contractors' },
  { code: '238330', name: 'Flooring Contractors' },
  { code: '238340', name: 'Tile and Terrazzo Contractors' },
  { code: '238350', name: 'Finish Carpentry Contractors' },
  { code: '238390', name: 'Other Building Finishing Contractors' },
  { code: '238910', name: 'Site Preparation Contractors' },
  { code: '238990', name: 'All Other Specialty Trade Contractors' },
];

export interface NAICSSelectorProps {
  value?: string;
  onChange: (naicsCode: string) => void;
  onBack?: () => void;
  disabled?: boolean;
  className?: string;
  showSearch?: boolean;
}

export function NAICSSelector({
  value,
  onChange,
  onBack,
  disabled,
  className,
  showSearch = true,
}: NAICSSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedSubsector, setSelectedSubsector] = useState<string | null>(null);

  // Filter sectors by search
  const filteredSectors = useMemo(() => {
    if (!searchQuery) return naicsSectors;
    const query = searchQuery.toLowerCase();
    return naicsSectors.filter(
      (s) =>
        s.code.includes(query) ||
        s.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Get subsectors for selected sector (mock data - only construction for now)
  const subsectors = useMemo(() => {
    if (selectedSector === '23') return constructionSubsectors;
    return [];
  }, [selectedSector]);

  // Get industries for selected subsector (mock data)
  const industries = useMemo(() => {
    if (selectedSubsector === '238') return specialtyTradeIndustries;
    return [];
  }, [selectedSubsector]);

  const handleSectorSelect = (code: string) => {
    setSelectedSector(code);
    setSelectedSubsector(null);
    // If no subsectors, select the sector code
    if (code !== '23') {
      onChange(code);
    }
  };

  const handleSubsectorSelect = (code: string) => {
    setSelectedSubsector(code);
    // If no industries, select the subsector code
    if (code !== '238') {
      onChange(code);
    }
  };

  const handleIndustrySelect = (code: string) => {
    onChange(code);
  };

  // Show industries if subsector selected
  if (selectedSubsector && industries.length > 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => setSelectedSubsector(null)}
              className="text-sm text-blue-600 hover:underline mb-1"
            >
              Back to subsectors
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Select Your Industry
            </h2>
            <p className="text-sm text-gray-500">
              Choose the most specific industry that matches your business
            </p>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {industries.map((industry) => (
            <button
              key={industry.code}
              type="button"
              onClick={() => handleIndustrySelect(industry.code)}
              disabled={disabled}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left',
                value === industry.code
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-gray-500">{industry.code}</span>
                <span className="font-medium text-gray-900">{industry.name}</span>
              </div>
              {value === industry.code && (
                <Check className="h-5 w-5 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Show subsectors if sector selected
  if (selectedSector && subsectors.length > 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => setSelectedSector(null)}
              className="text-sm text-blue-600 hover:underline mb-1"
            >
              Back to sectors
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Select Your Subsector
            </h2>
            <p className="text-sm text-gray-500">
              Narrow down to get more specific configurations
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {subsectors.map((subsector) => (
            <button
              key={subsector.code}
              type="button"
              onClick={() => handleSubsectorSelect(subsector.code)}
              disabled={disabled}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left',
                value?.startsWith(subsector.code)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-gray-500">{subsector.code}</span>
                <span className="font-medium text-gray-900">{subsector.name}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Show sectors
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-blue-600 hover:underline mb-1"
            >
              Back to templates
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-900">
            Select Your Industry Sector
          </h2>
          <p className="text-sm text-gray-500">
            Optional: Get more specific industry configurations
          </p>
        </div>
      </div>

      {showSearch && (
        <Input
          placeholder="Search sectors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftAddon={<Search className="h-4 w-4 text-gray-400" />}
        />
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredSectors.map((sector) => (
          <button
            key={sector.code}
            type="button"
            onClick={() => handleSectorSelect(sector.code)}
            disabled={disabled}
            className={cn(
              'w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left',
              value?.startsWith(sector.code)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <div>
                <span className="text-xs font-mono text-gray-500">{sector.code}</span>
                <p className="font-medium text-gray-900">{sector.name}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
