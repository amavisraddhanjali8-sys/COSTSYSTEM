import { OutsourcedService } from '../types';

export const INITIAL_OUTSOURCED_SERVICES_DATA: OutsourcedService[] = [
  {
    id: 'out-01',
    code: 'SVC-ANOD-MIL8625',
    name: 'Hardcoat Anodizing Type III (Mil-A-8625)',
    providerId: 'sup-5',
    providerName: 'Global Heavy Haul & Logistics',
    category: 'Surface Treatment & Anodizing',
    subCategory: 'Hard Anodize Type III',
    moreSubCategory: '50-Micron Mil-Spec',
    baseUnitType: 'per_hour',
    rate: 85.00,
    retailPrice: 115.00,
    tierRates: [
      { minVolume: 1, maxVolume: 25, rate: 115.00, description: 'Standard Production Batch' },
      { minVolume: 26, maxVolume: 100, rate: 98.00, description: 'Medium Volume Discount' },
      { minVolume: 101, rate: 85.00, description: 'High Volume Fleet Tariff' }
    ],
    slaLevel: 'Tier-1 SLA (99.5%)',
    priceHistory: [
      {
        id: 'hist-out-1',
        date: '2026-10-01',
        oldRate: 80.00,
        newRate: 85.00,
        reason: 'Electrolyte Chemical Cost Adjustment',
        updatedBy: 'Lead Process Auditor'
      }
    ],
    lastUpdated: '2026-10-10'
  },
  {
    id: 'out-02',
    code: 'SVC-MET-CMM-ZEISS',
    name: 'Zeiss Coordinate Metrology & CMM Laser Scan',
    providerId: 'sup-5',
    providerName: 'Global Heavy Haul & Logistics',
    category: 'Metrology & NDT Inspection',
    subCategory: 'Zeiss CMM Inspection',
    moreSubCategory: 'Sub-Micron Verification',
    baseUnitType: 'per_hour',
    rate: 140.00,
    retailPrice: 185.00,
    tierRates: [
      { minVolume: 1, maxVolume: 10, rate: 185.00, description: 'First Article Inspection (FAI)' },
      { minVolume: 11, maxVolume: 50, rate: 160.00, description: 'Batch Sampling Verification' },
      { minVolume: 51, rate: 140.00, description: 'Production 100% Run Verification' }
    ],
    slaLevel: 'Mission Critical 24/7',
    priceHistory: [],
    lastUpdated: '2026-10-08'
  },
  {
    id: 'out-03',
    code: 'SVC-HAUL-LOWBOY-US',
    name: 'Heavy Interstate Machinery Lowboy Haulage',
    providerId: 'sup-5',
    providerName: 'Global Heavy Haul & Logistics',
    category: 'Heavy Transportation & Logistics',
    subCategory: 'Air-Ride Lowboy Transport',
    moreSubCategory: 'Oversized Cargo Escort',
    baseUnitType: 'per_km',
    rate: 12.50,
    retailPrice: 16.50,
    tierRates: [
      { minVolume: 1, maxVolume: 500, rate: 16.50, description: 'Regional Transit' },
      { minVolume: 501, maxVolume: 2000, rate: 14.00, description: 'Interstate Long-Haul' },
      { minVolume: 2001, rate: 12.50, description: 'Trans-Continental Freight' }
    ],
    slaLevel: 'Tier-1 SLA (99.5%)',
    priceHistory: [],
    lastUpdated: '2026-10-05'
  },
  {
    id: 'out-04',
    code: 'SVC-HEAT-VAC-RELIEF',
    name: 'Vacuum Stress Relieving & Solution Annealing',
    providerId: 'sup-5',
    providerName: 'Global Heavy Haul & Logistics',
    category: 'Surface Treatment & Anodizing',
    subCategory: 'Vacuum Stress Relieving',
    moreSubCategory: 'Aerospace Vacuum Furnace',
    baseUnitType: 'per_hour',
    rate: 95.00,
    retailPrice: 130.00,
    tierRates: [
      { minVolume: 1, maxVolume: 20, rate: 130.00, description: 'Small Lot Vacuum Furnace' },
      { minVolume: 21, rate: 95.00, description: 'Full Chamber Batch Load' }
    ],
    slaLevel: 'Standard SLA',
    priceHistory: [],
    lastUpdated: '2026-10-03'
  },
  {
    id: 'out-05',
    code: 'SVC-NDT-UT-DYE',
    name: 'Ultrasonic & Fluorescent Penetrant Inspection',
    providerId: 'sup-5',
    providerName: 'Global Heavy Haul & Logistics',
    category: 'Metrology & NDT Inspection',
    subCategory: 'Non-Destructive Testing',
    moreSubCategory: 'Level III NDT Testing',
    baseUnitType: 'per_hour',
    rate: 110.00,
    retailPrice: 150.00,
    tierRates: [
      { minVolume: 1, maxVolume: 15, rate: 150.00, description: 'Standard Non-Destructive Scan' },
      { minVolume: 16, rate: 110.00, description: 'Extended Weld Integrity Scan' }
    ],
    slaLevel: 'Tier-1 SLA (99.5%)',
    priceHistory: [],
    lastUpdated: '2026-10-09'
  },
  {
    id: 'out-06',
    code: 'SVC-CRANE-RIG-50T',
    name: 'Industrial Gantry Rigging & 50-Ton Crane Services',
    providerId: 'sup-5',
    providerName: 'Global Heavy Haul & Logistics',
    category: 'Heavy Transportation & Logistics',
    subCategory: 'Crane & Rigging Services',
    moreSubCategory: 'Precision Positioning',
    baseUnitType: 'per_hour',
    rate: 175.00,
    retailPrice: 225.00,
    tierRates: [
      { minVolume: 1, maxVolume: 8, rate: 225.00, description: 'Hourly Precision Rigging' },
      { minVolume: 9, rate: 175.00, description: 'Multi-Day Plant Install Tariff' }
    ],
    slaLevel: 'Premium 99.9%',
    priceHistory: [],
    lastUpdated: '2026-10-11'
  }
];
