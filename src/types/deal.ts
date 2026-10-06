export interface DealAttachmentMeta {
  _id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedBy?: string;
  uploadedAt: string;
}

export interface DealRequirement {
  _id: string;
  title: string;
  description: string;
  attachments: DealAttachmentMeta[];
  createdAt: string;
  updatedAt: string;
}

export interface DealReport {
  _id: string;
  date: string;
  workCompleted: string;
  comment: string;
  nextPlan: string;
  attachments: DealAttachmentMeta[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealClient {
  name: string;
  mobileNumber1: string;
  mobileNumber2: string;
  email1: string;
  email2: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface DealLeadSnapshot {
  title: string;
  categoryName: string;
  address: string;
  city: string;
  website: string;
  phone: string;
  phoneUnformatted: string;
  leadCreatedAt?: string;
  leadUpdatedAt?: string;
}

export interface Deal {
  _id: string;
  sourceLeadId: string | { _id: string; title?: string; status?: string };
  leadSnapshot: DealLeadSnapshot;
  status: 'Converted';
  projectReceivedDate?: string;
  client: DealClient;
  requirements: DealRequirement[];
  reports: DealReport[];
  createdAt: string;
  updatedAt: string;
}

export interface DealListResponse {
  success: boolean;
  data: Deal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DealReportsResponse {
  success: boolean;
  data: DealReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function dealSourceLeadId(deal: Deal): string {
  if (typeof deal.sourceLeadId === 'string') return deal.sourceLeadId;
  return deal.sourceLeadId?._id || '';
}

export function emptyDealClient(): DealClient {
  return {
    name: '',
    mobileNumber1: '',
    mobileNumber2: '',
    email1: '',
    email2: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  };
}

export function formatDealDate(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function toDateInputValue(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const v = bytes / Math.pow(1024, i);
  return `${v >= 100 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

export function attachmentUrl(attId: string): string {
  return `${import.meta.env.VITE_BASE_URL}/api/deals/attachment/${attId}`;
}

export function isImageAttachment(contentType: string): boolean {
  return String(contentType || '').toLowerCase().startsWith('image/');
}
