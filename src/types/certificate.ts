export interface Certificate {
  _id: string;
  certificateId: string;
  firstName: string;
  lastName: string;
  college: string;
  email: string;
  mobileNumber: string;
  course: string;
  internshipTrainingCourse: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  durationDays: number;
  durationText: string;
  hrHeadName: string;
  hrHeadDesignation: string;
  hrHeadSignature: string;
  managerName: string;
  managerDesignation: string;
  managerSignature: string;
  verificationSlug: string;
  status: 'valid' | 'revoked';
  createdAt: string;
  updatedAt: string;
}

export interface CertificateListResponse {
  success: boolean;
  data: Certificate[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const fullName = (c: Pick<Certificate, 'firstName' | 'lastName'>): string =>
  `${c.firstName} ${c.lastName}`.trim();

export function formatCertDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}
