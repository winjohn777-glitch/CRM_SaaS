import type { NAICSCode } from '@crm/types';

/**
 * NAICS Hierarchy Utilities
 *
 * NAICS code structure:
 * - 2 digits: Sector (e.g., "23" = Construction)
 * - 3 digits: Subsector (e.g., "238" = Specialty Trade Contractors)
 * - 4 digits: Industry Group (e.g., "2381" = Foundation, Structure, Building Exterior)
 * - 5 digits: NAICS Industry (e.g., "23816" = Roofing Contractors)
 * - 6 digits: National Industry (e.g., "238160" = Roofing Contractors)
 */
export class NAICSUtils {
  /**
   * Get the complete hierarchy for a NAICS code
   * e.g., "238160" -> ["23", "238", "2381", "23816", "238160"]
   */
  static getHierarchy(naicsCode: string): string[] {
    const hierarchy: string[] = [];
    const code = naicsCode.replace(/[^0-9]/g, '');

    if (code.length >= 2) hierarchy.push(code.substring(0, 2));
    if (code.length >= 3) hierarchy.push(code.substring(0, 3));
    if (code.length >= 4) hierarchy.push(code.substring(0, 4));
    if (code.length >= 5) hierarchy.push(code.substring(0, 5));
    if (code.length >= 6) hierarchy.push(code.substring(0, 6));

    return hierarchy;
  }

  /**
   * Get the level of a NAICS code
   */
  static getLevel(naicsCode: string): NAICSCode['level'] {
    const code = naicsCode.replace(/[^0-9]/g, '');
    switch (code.length) {
      case 2: return 'sector';
      case 3: return 'subsector';
      case 4: return 'industry-group';
      case 5: return 'naics-industry';
      case 6: return 'national-industry';
      default: return 'sector';
    }
  }

  /**
   * Get the sector code from any NAICS code
   */
  static getSector(naicsCode: string): string {
    return naicsCode.replace(/[^0-9]/g, '').substring(0, 2);
  }

  /**
   * Get the subsector code from any NAICS code
   */
  static getSubsector(naicsCode: string): string | null {
    const code = naicsCode.replace(/[^0-9]/g, '');
    return code.length >= 3 ? code.substring(0, 3) : null;
  }

  /**
   * Check if a NAICS code is within a sector
   */
  static isInSector(naicsCode: string, sectorCode: string): boolean {
    return this.getSector(naicsCode) === sectorCode;
  }

  /**
   * Validate a NAICS code format
   */
  static isValid(naicsCode: string): boolean {
    const code = naicsCode.replace(/[^0-9]/g, '');
    return code.length >= 2 && code.length <= 6;
  }

  /**
   * Format a NAICS code with dashes for display
   */
  static format(naicsCode: string): string {
    const code = naicsCode.replace(/[^0-9]/g, '');
    if (code.length <= 2) return code;
    if (code.length <= 4) return `${code.substring(0, 2)}-${code.substring(2)}`;
    return `${code.substring(0, 2)}-${code.substring(2, 4)}-${code.substring(4)}`;
  }

  /**
   * Common NAICS sector codes with names
   */
  static readonly SECTORS: Record<string, string> = {
    '11': 'Agriculture, Forestry, Fishing and Hunting',
    '21': 'Mining, Quarrying, and Oil and Gas Extraction',
    '22': 'Utilities',
    '23': 'Construction',
    '31': 'Manufacturing',
    '32': 'Manufacturing',
    '33': 'Manufacturing',
    '42': 'Wholesale Trade',
    '44': 'Retail Trade',
    '45': 'Retail Trade',
    '48': 'Transportation and Warehousing',
    '49': 'Transportation and Warehousing',
    '51': 'Information',
    '52': 'Finance and Insurance',
    '53': 'Real Estate and Rental and Leasing',
    '54': 'Professional, Scientific, and Technical Services',
    '55': 'Management of Companies and Enterprises',
    '56': 'Administrative and Support and Waste Management',
    '61': 'Educational Services',
    '62': 'Health Care and Social Assistance',
    '71': 'Arts, Entertainment, and Recreation',
    '72': 'Accommodation and Food Services',
    '81': 'Other Services (except Public Administration)',
    '92': 'Public Administration',
  };

  /**
   * Get sector name from code
   */
  static getSectorName(sectorCode: string): string {
    return this.SECTORS[sectorCode] || 'Unknown Sector';
  }

  /**
   * Get all sector codes
   */
  static getAllSectorCodes(): string[] {
    return Object.keys(this.SECTORS);
  }
}
