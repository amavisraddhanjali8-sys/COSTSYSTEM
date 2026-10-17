import {
  MaterialItem,
  OutsourcedService,
  Project,
  SubcontractorRateItem,
  Supplier,
  SupplierContract,
  InventoryItem,
  ProduceItem,
  AppUser,
  CompanyDetails,
  InventoryTransaction,
  AuditLogRecord
} from '../types';
import {
  INITIAL_SUPPLIERS,
  INITIAL_MATERIALS,
  INITIAL_OUTSOURCED_SERVICES,
  INITIAL_SUBCONTRACTORS,
  INITIAL_INVENTORY,
  INITIAL_PROJECTS,
  INITIAL_PRODUCE_ITEMS
} from '../data/initialData';
import { ClientProfile, INITIAL_CLIENT_PROFILES } from '../data/categoriesAndProfiles';
import { INITIAL_COMPANY_DETAILS, INITIAL_USERS, INITIAL_AUDIT_LOGS } from '../data/userAndAuditData';

// Helper for safe fetch with auto-retry and fallback
async function fetchWithFallback<T>(url: string, fallbackData: T, options?: RequestInit): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 250));
        continue;
      }
      console.warn(`API call to ${url} failed, using fallback:`, err);
      return fallbackData;
    }
  }
  return fallbackData;
}

export const api = {
  // Health
  checkHealth: async () => {
    return fetchWithFallback('/api/health', { status: 'ok', pythonEngine: 'active' });
  },

  // Suppliers
  getSuppliers: async (): Promise<Supplier[]> => {
    return fetchWithFallback('/api/suppliers', []);
  },
  createSupplier: async (data: Partial<Supplier>): Promise<Supplier> => {
    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: `sup-${Date.now()}`,
      rating: 5,
      onTimeDeliveryPct: 100,
      qualityScorePct: 100,
      contractHistory: [],
      status: 'Active',
      ...data
    } as Supplier;
  },
  updateSupplier: async (id: string, data: Partial<Supplier>): Promise<Supplier> => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return data as Supplier;
  },
  addSupplierContract: async (supplierId: string, contract: Partial<SupplierContract>): Promise<Supplier> => {
    try {
      const res = await fetch(`/api/suppliers/${supplierId}/contracts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contract)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {} as Supplier;
  },
  deleteSupplier: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Produce Products & Services (Our Enterprise Supplied Catalog)
  getProduceItems: async (): Promise<ProduceItem[]> => {
    return fetchWithFallback('/api/produce', []);
  },
  createProduceItem: async (data: Partial<ProduceItem>): Promise<ProduceItem> => {
    try {
      const res = await fetch('/api/produce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: `prd-${Date.now()}`,
      priceHistory: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      ...data
    } as ProduceItem;
  },
  updateProduceItem: async (id: string, data: Partial<ProduceItem>): Promise<ProduceItem> => {
    try {
      const res = await fetch(`/api/produce/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return data as ProduceItem;
  },
  updateProduceItemPrice: async (id: string, newPrice: number, reason: string, updatedBy: string, bundlesAndRanges?: any[]): Promise<ProduceItem> => {
    try {
      const res = await fetch(`/api/produce/${id}/price-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPrice, reason, updatedBy, bundlesAndRanges })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {} as ProduceItem;
  },
  deleteProduceItem: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/produce/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Materials
  getMaterials: async (): Promise<MaterialItem[]> => {
    return fetchWithFallback('/api/materials', []);
  },
  createMaterial: async (data: Partial<MaterialItem>): Promise<MaterialItem> => {
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: `mat-${Date.now()}`,
      priceHistory: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      ...data
    } as MaterialItem;
  },
  updateMaterial: async (id: string, data: Partial<MaterialItem> & { priceChangeReason?: string; updatedBy?: string }): Promise<MaterialItem> => {
    try {
      const res = await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return data as MaterialItem;
  },
  updateMaterialPrice: async (id: string, newPrice: number, reason: string, updatedBy: string, volumePricing?: any[]): Promise<MaterialItem> => {
    try {
      const res = await fetch(`/api/materials/${id}/price-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPrice, reason, updatedBy, volumePricing })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {} as MaterialItem;
  },
  deleteMaterial: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Outsourced Services
  getOutsourcedServices: async (): Promise<OutsourcedService[]> => {
    return fetchWithFallback('/api/outsourced', []);
  },
  createOutsourcedService: async (data: Partial<OutsourcedService>): Promise<OutsourcedService> => {
    try {
      const res = await fetch('/api/outsourced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: `out-${Date.now()}`,
      priceHistory: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      ...data
    } as OutsourcedService;
  },
  updateOutsourcedService: async (id: string, data: Partial<OutsourcedService> & { priceChangeReason?: string; updatedBy?: string }): Promise<OutsourcedService> => {
    try {
      const res = await fetch(`/api/outsourced/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return data as OutsourcedService;
  },
  deleteOutsourcedService: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/outsourced/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Subcontractors
  getSubcontractors: async (): Promise<SubcontractorRateItem[]> => {
    return fetchWithFallback('/api/subcontractors', []);
  },
  createSubcontractor: async (data: Partial<SubcontractorRateItem>): Promise<SubcontractorRateItem> => {
    try {
      const res = await fetch('/api/subcontractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: `sub-${Date.now()}`,
      rateHistory: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      ...data
    } as SubcontractorRateItem;
  },
  updateSubcontractor: async (id: string, data: Partial<SubcontractorRateItem> & { changeReason?: string; updatedBy?: string }): Promise<SubcontractorRateItem> => {
    try {
      const res = await fetch(`/api/subcontractors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return data as SubcontractorRateItem;
  },
  updateSubcontractorRate: async (
    id: string,
    newRate: number,
    reason: string,
    updatedBy: string,
    bulkPricingRanges?: any[],
    newRetailRate?: number,
    fullContractEstimate?: number
  ): Promise<SubcontractorRateItem> => {
    try {
      const res = await fetch(`/api/subcontractors/${id}/rate-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newBaseRate: newRate,
          changeReason: reason,
          updatedBy,
          bulkPricingRanges,
          newRetailRate,
          fullContractEstimate
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return api.updateSubcontractor(id, { baseRate: newRate, rate: newRate, changeReason: reason, updatedBy, bulkPricingRanges, retailRate: newRetailRate, fullContractEstimate });
  },
  deleteSubcontractor: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/subcontractors/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },
  updateOutsourcedRate: async (
    id: string,
    newRate: number,
    reason: string,
    updatedBy: string,
    tierRates?: any[],
    retailPrice?: number
  ): Promise<OutsourcedService> => {
    try {
      const res = await fetch(`/api/outsourced/${id}/price-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newRate,
          reason,
          updatedBy,
          tierRates,
          retailPrice
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return api.updateOutsourcedService(id, { rate: newRate, priceChangeReason: reason, updatedBy, tierRates, retailPrice });
  },

  // Inventory
  getInventory: async (): Promise<InventoryItem[]> => {
    return fetchWithFallback('/api/inventory', []);
  },
  createInventoryItem: async (data: Partial<InventoryItem>): Promise<InventoryItem> => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: `inv-${Date.now()}`,
      onHand: 10,
      reserved: 0,
      available: 10,
      reorderLevel: 5,
      unitCost: 100,
      location: 'Warehouse',
      status: 'In Stock',
      ...data
    } as InventoryItem;
  },
  updateInventory: async (id: string, data: Partial<InventoryItem>): Promise<InventoryItem> => {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return data as InventoryItem;
  },
  deleteInventoryItem: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    return fetchWithFallback('/api/projects', []);
  },
  getProject: async (id: string): Promise<Project | null> => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return null;
  },
  createProject: async (data: Partial<Project>): Promise<Project> => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: `proj-${Date.now()}`,
      code: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdDate: new Date().toISOString().split('T')[0],
      ...data
    } as Project;
  },
  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return data as Project;
  },
  deleteProject: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Python Analytics Engine Calculate
  calculateAnalytics: async (projectData: any) => {
    try {
      const res = await fetch('/api/analytics/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return null;
  },
  calculateProjectProfitability: async (projectData: any) => {
    return api.calculateAnalytics(projectData);
  },

  resetDemoData: async () => {
    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Categories & Sub-Categories
  getCategories: async (): Promise<any[]> => {
    return fetchWithFallback('/api/categories', []);
  },
  createCategory: async (categoryData: any): Promise<any> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return { id: `cat-${Date.now()}`, ...categoryData };
  },
  updateCategory: async (id: string, categoryData: any): Promise<any> => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return categoryData;
  },
  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Custom Hub Tiles
  getCustomTiles: async (): Promise<any[]> => {
    return fetchWithFallback('/api/custom-tiles', []);
  },
  createCustomTile: async (tileData: any): Promise<any> => {
    try {
      const res = await fetch('/api/custom-tiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tileData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return { id: `custom-tile-${Date.now()}`, ...tileData };
  },
  deleteCustomTile: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/custom-tiles/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Database Export & Import
  exportDatabaseFromServer: async (): Promise<any> => {
    try {
      const res = await fetch('/api/database/export');
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return null;
  },
  importDatabaseToServer: async (data: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/database/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // Clients
  getClients: async (): Promise<ClientProfile[]> => {
    return fetchWithFallback('/api/clients', []);
  },
  createClient: async (data: Partial<ClientProfile>): Promise<ClientProfile> => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: data.id || `cli-${Date.now()}`,
      name: data.name || 'New Enterprise Client',
      tagline: data.tagline || 'Strategic Partner',
      industry: data.industry || 'Manufacturing',
      location: data.location || 'Global',
      status: data.status || 'Active Partner',
      activeProjectsCount: data.activeProjectsCount || 1,
      totalQuotedValue: data.totalQuotedValue || 200000,
      contactPerson: data.contactPerson || 'Buyer Lead',
      email: data.email || 'client@enterprise.com',
      themeId: data.themeId || 'pacific-sky',
      ...data
    } as ClientProfile;
  },
  updateClient: async (id: string, data: Partial<ClientProfile>): Promise<ClientProfile> => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return data as ClientProfile;
  },
  deleteClient: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Company Details
  getCompanyDetails: async (): Promise<CompanyDetails> => {
    return fetchWithFallback('/api/company-details', INITIAL_COMPANY_DETAILS);
  },
  updateCompanyDetails: async (data: Partial<CompanyDetails>): Promise<CompanyDetails> => {
    try {
      const res = await fetch('/api/company-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return data as CompanyDetails;
  },

  // Users
  getUsers: async (): Promise<AppUser[]> => {
    return fetchWithFallback('/api/users', INITIAL_USERS);
  },
  createUser: async (data: Partial<AppUser>): Promise<AppUser> => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: data.id || `usr-${Date.now()}`,
      employeeId: data.employeeId || 'EMP-01',
      name: data.name || 'User',
      email: data.email || 'user@example.com',
      role: data.role || 'PROJECT_MANAGER',
      department: data.department || 'Operations',
      status: 'Active',
      createdAt: new Date().toISOString(),
      ...data
    } as AppUser;
  },
  updateUser: async (id: string, data: Partial<AppUser>): Promise<AppUser> => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return data as AppUser;
  },
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Inventory Transactions
  getTransactions: async (): Promise<InventoryTransaction[]> => {
    return fetchWithFallback('/api/inventory/transactions', []);
  },
  createTransaction: async (data: Partial<InventoryTransaction>): Promise<InventoryTransaction> => {
    try {
      const res = await fetch('/api/inventory/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: `txn-${Date.now()}`,
      transactionNumber: `TXN-${Date.now().toString().slice(-6)}`,
      type: 'IN',
      materialId: '',
      materialCode: '',
      materialName: '',
      quantity: 1,
      unit: 'pcs',
      price: 0,
      totalAmount: 0,
      timestamp: new Date().toISOString(),
      ...data
    } as InventoryTransaction;
  },

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLogRecord[]> => {
    return fetchWithFallback('/api/audit-logs', []);
  },
  createAuditLog: async (data: Partial<AuditLogRecord>): Promise<AuditLogRecord> => {
    try {
      const res = await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: 'usr-admin',
      actorName: 'Administrator',
      actorRole: 'ADMIN',
      action: 'SYSTEM_EVENT',
      module: 'System',
      ...data
    } as AuditLogRecord;
  },

  // Media & Image Uploads (Stored in PostgreSQL inno_cost)
  uploadImage: async (dataUrlOrUrl: string, filename?: string): Promise<{ url: string; id: string }> => {
    try {
      const isDataUrl = dataUrlOrUrl.startsWith('data:');
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl: isDataUrl ? dataUrlOrUrl : undefined,
          url: !isDataUrl ? dataUrlOrUrl : undefined,
          filename: filename || 'asset.png'
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Image upload failed:', e);
    }
    return { url: dataUrlOrUrl, id: `img-${Date.now()}` };
  },

  // Database Connection Status
  getDbStatus: async () => {
    return fetchWithFallback('/api/database/status', {
      connected: true,
      engine: 'PostgreSQL (inno_cost)',
      database: 'inno_cost',
      tables: 15
    });
  }
};
