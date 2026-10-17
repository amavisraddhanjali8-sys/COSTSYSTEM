import { TileTheme, getThemeById } from './tileThemes';

export interface CategoryNode {
  id: string;
  name: string;
  type: 'category' | 'sub_category' | 'sub_sub_category';
  group: 'material' | 'product' | 'service' | 'subcontractor' | 'outsourced';
  parentId?: string;
  parentName?: string;
  grandParentId?: string;
  grandParentName?: string;
  brief: string; // Few words/details
  itemCount?: number;
  themeId?: string;
  customGradient?: string;
  metaBadge?: string;
  actionText?: string;
  rateRange?: string;
  baseRate?: number;
  unit?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  tagline: string; // concise
  industry: string;
  location: string;
  status: 'Active Partner' | 'Strategic Tier 1' | 'Key Account';
  activeProjectsCount: number;
  totalQuotedValue: number;
  contactPerson: string;
  email: string;
  themeId: string;
  customGradient?: string;
}

export const INITIAL_CLIENT_PROFILES: ClientProfile[] = [
  {
    id: 'cli-01',
    name: 'Lockheed Aero Structures',
    tagline: 'Tier-1 Defense & Aerospace Prime',
    industry: 'Aerospace & Defense',
    location: 'Bethesda, MD, USA',
    status: 'Strategic Tier 1',
    activeProjectsCount: 2,
    totalQuotedValue: 2850000,
    contactPerson: 'David K. Vance',
    email: 'procurement@lockheed-aero.com',
    themeId: 'pacific-sky'
  },
  {
    id: 'cli-02',
    name: 'SpaceX Aerostructures Group',
    tagline: 'Commercial Spaceflight & Propulsion',
    industry: 'Space Technologies',
    location: 'Hawthorne, CA, USA',
    status: 'Strategic Tier 1',
    activeProjectsCount: 1,
    totalQuotedValue: 1950000,
    contactPerson: 'Sarah Lin',
    email: 'vendor-relations@spacex-aero.com',
    themeId: 'airbus-cobalt'
  },
  {
    id: 'cli-03',
    name: 'Tesla Gigafactory Texas',
    tagline: 'Clean Transportation & Grid Energy',
    industry: 'Automotive & Energy',
    location: 'Austin, TX, USA',
    status: 'Key Account',
    activeProjectsCount: 1,
    totalQuotedValue: 1450000,
    contactPerson: 'Robert Miller',
    email: 'supplychain@tesla-energy.com',
    themeId: 'amber-flame'
  },
  {
    id: 'cli-04',
    name: 'Northrop Marine Systems',
    tagline: 'Naval Defense & Marine Architecture',
    industry: 'Naval & Marine Defense',
    location: 'San Diego, CA, USA',
    status: 'Key Account',
    activeProjectsCount: 1,
    totalQuotedValue: 980000,
    contactPerson: 'Elena Rostova',
    email: 'contracts@northropmarine.com',
    themeId: 'emerald-isle'
  }
];

export const INITIAL_CATEGORY_HIERARCHY: CategoryNode[] = [];

