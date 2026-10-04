// Central certificate authority configuration (mirrors backend utils/certificate.js CONFIG).
// Default HR / Manager details are applied automatically to every certificate;
// per-certificate signature images can be uploaded in the generate form.
export const CERTIFICATE_CONFIG = {
  hrHeadName: 'Ritu Chouhan',
  hrHeadDesignation: 'HR HEAD',
  hrHeadSignature: '',
  managerName: 'Prakash Bankhede',
  managerDesignation: 'Manager',
  managerSignature: ''
};

export function verificationBaseUrl(): string {
  const base = (import.meta.env.VITE_SITE_URL as string) || 'https://sosapient.in';
  return base.replace(/\/+$/, '');
}

export function verificationUrl(candidateSlug: string, certificateId: string): string {
  return `${verificationBaseUrl()}/${candidateSlug}/${String(certificateId).toUpperCase()}`;
}
