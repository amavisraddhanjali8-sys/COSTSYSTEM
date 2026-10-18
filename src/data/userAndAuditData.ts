import { AppUser, AccountRequest, CompanyDetails, AuditLogRecord } from '../types';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'user-001',
    employeeId: 'ADMIN-01',
    name: 'Administrator',
    email: 'nssl.graphics@gmail.com',
    role: 'ADMIN',
    department: 'Executive Management',
    status: 'Active',
    createdAt: '2026-01-15 08:30:00',
    lastLogin: '2026-09-12 13:30:00'
  }
];

export const INITIAL_ACCOUNT_REQUESTS: AccountRequest[] = [];

export const INITIAL_COMPANY_DETAILS: CompanyDetails = {
  name: 'FXTT Enterprise Solutions Ltd',
  registrationNumber: 'FX-CORP-2026-88910',
  taxId: 'LK-VAT-94-3829104',
  email: 'corporate@fxtt-enterprise.com',
  phone: '+94 11 234 5678',
  address: '100 Galle Road, World Trade Center Tower, Colombo 01, Sri Lanka',
  website: 'https://www.fxtt-enterprise.com',
  currency: 'LKR (Rs.)',
  logoUrl: '',
  logoPosition: 'left',
  tagline: 'Cost & Profitability System • Materials, Outsourced Tariffs & Multi-Phase Costing (LKR)'
};

export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [];

// In memory copies. The server (PostgreSQL) is the source of truth.
const memory = new Map<string, string>();
const store = {
  getItem: (k: string) => (memory.has(k) ? memory.get(k)! : null),
  setItem: (k: string, v: string) => { memory.set(k, v); }
};
const USERS_STORAGE_KEY = 'fxtt_users_list';
const REQUESTS_STORAGE_KEY = 'fxtt_account_requests';
const COMPANY_STORAGE_KEY = 'fxtt_company_details';
const AUDIT_STORAGE_KEY = 'fxtt_audit_records';
const CURRENT_USER_STORAGE_KEY = 'fxtt_current_user';

// Demo accounts to purge
const DEMO_EMPLOYEE_IDS = new Set(['EMP-ADM-01', 'EMP-ADM-02', 'EMP-PM-01', 'EMP-PM-02']);
const DEMO_NAMES = new Set(['Jane Doe', 'Marcus Vance', 'Alex Chen', 'Sarah Connor']);

export function getStoredUsers(): AppUser[] {
  try {
    const raw = store.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as any[];
      if (Array.isArray(parsed)) {
        // Prune any legacy demo accounts & remove any credentials from frontend storage
        const cleaned: AppUser[] = parsed
          .filter(
            (u) => !DEMO_EMPLOYEE_IDS.has(u?.employeeId) && !DEMO_NAMES.has(u?.name)
          )
          .map((u) => {
            const { password, passwordHash, passwordSalt, ...safe } = u;
            return safe as AppUser;
          });

        // Ensure Admin exists
        const adminIdx = cleaned.findIndex((u) => u.role === 'ADMIN');
        if (adminIdx === -1) {
          // no admin in list: leave as is (server decides)
        } else {
          // If admin email was still the legacy placeholder, update to user's real email
          if (cleaned[adminIdx].email === 'innovistametal@gmail.com') {
            cleaned[adminIdx].email = 'nssl.graphics@gmail.com';
          }
        }
        store.setItem(USERS_STORAGE_KEY, JSON.stringify(cleaned));
        return cleaned;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveStoredUsers(users: AppUser[]): void {
  try {
    const sanitized = users.map((u) => {
      const { password, ...safe } = u as any;
      return safe;
    });
    store.setItem(USERS_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredRequests(): AccountRequest[] {
  try {
    const raw = store.getItem(REQUESTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_ACCOUNT_REQUESTS;
}

export function saveStoredRequests(requests: AccountRequest[]): void {
  try {
    store.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredCompanyDetails(): CompanyDetails {
  try {
    const raw = store.getItem(COMPANY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.currency || parsed.currency.includes('USD')) {
        parsed.currency = 'LKR (Rs.)';
      }
      return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_COMPANY_DETAILS;
}

export function saveStoredCompanyDetails(details: CompanyDetails): void {
  try {
    store.setItem(COMPANY_STORAGE_KEY, JSON.stringify(details));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredAuditLogs(): AuditLogRecord[] {
  try {
    const raw = store.getItem(AUDIT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_AUDIT_LOGS;
}

export function saveStoredAuditLogs(logs: AuditLogRecord[]): void {
  try {
    store.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredCurrentUser(): AppUser | null {
  try {
    const token = store.getItem('fxtt_session_token');
    if (!token) return null;
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (raw) {
      const user = JSON.parse(raw) as AppUser;
      if (user && !DEMO_EMPLOYEE_IDS.has(user.employeeId) && !DEMO_NAMES.has(user.name)) {
        return user;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function saveStoredCurrentUser(user: AppUser | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (e) {
    console.error(e);
  }
}
