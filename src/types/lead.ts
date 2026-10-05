export type LeadStatus = 'New' | 'Message' | 'WhatsApp' | 'Call' | 'Converted';

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Message', 'WhatsApp', 'Call', 'Converted'];

export interface Lead {
  _id: string;
  title: string;
  categoryName: string;
  address: string;
  city: string;
  website: string;
  phone: string;
  phoneUnformatted: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadListResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  withMobile: number;
  withWebsite: number;
}

export interface LeadFilterOptions {
  cities: string[];
  categories: string[];
}

export type ImportVerdict = 'new' | 'in-file-duplicate' | 'exists-db' | 'possible' | 'invalid';

export interface ImportPreviewRow {
  index: number;
  lead: Partial<Lead>;
  verdict: ImportVerdict;
  reason: string;
}

export interface ImportSummary {
  total: number;
  new: number;
  inFileDuplicate: number;
  existsDb: number;
  possible: number;
  invalid: number;
}

export interface ImportResult {
  success: boolean;
  message: string;
  processed: number;
  imported: number;
  skipped: number;
  duplicates: number;
  errors: number;
  errorDetails: { index: number; message: string }[];
  mode: 'new-only' | 'all';
}

export const leadStatusTone = (status: LeadStatus): 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' => {
  switch (status) {
    case 'New':
      return 'blue';
    case 'Message':
      return 'purple';
    case 'WhatsApp':
      return 'green';
    case 'Call':
      return 'yellow';
    case 'Converted':
      return 'gray';
    default:
      return 'gray';
  }
};

export const importVerdictTone = (verdict: ImportVerdict): 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' => {
  switch (verdict) {
    case 'new':
      return 'green';
    case 'in-file-duplicate':
      return 'yellow';
    case 'exists-db':
      return 'gray';
    case 'possible':
      return 'purple';
    case 'invalid':
      return 'red';
    default:
      return 'gray';
  }
};

export const importVerdictLabel = (verdict: ImportVerdict): string => {
  switch (verdict) {
    case 'new':
      return 'New';
    case 'in-file-duplicate':
      return 'Duplicate in file';
    case 'exists-db':
      return 'Already exists';
    case 'possible':
      return 'Possible duplicate';
    case 'invalid':
      return 'Invalid';
    default:
      return verdict;
  }
};

// Absolute URL for website links. Prepends https:// when the stored
// value has no scheme so it never resolves as a relative path.
export function leadWebsiteUrl(website: string): string {
  const v = String(website || '').trim();
  if (v === '') return '';
  return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
}

// Digits for wa.me links. Empty when no meaningful number.
export function leadDigits(lead: Pick<Lead, 'phone' | 'phoneUnformatted'>): string {
  const digits = String(lead.phoneUnformatted || lead.phone || '').replace(/\D/g, '');
  return digits.length >= 7 ? digits : '';
}

export function formatLeadDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
