import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Link2, FileDown, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { authFetch } from '../../utils/api';
import { PageHeader, ContentCard, SecondaryButton } from '../../components/admin/ui';
import CertificateForm, { emptyCertificateForm, CertificateFormValues } from '../../components/certificates/CertificateForm';
import CertificateTemplate, { CertificateTemplateHandle } from '../../components/certificates/CertificateTemplate';
import { Certificate } from '../../types/certificate';
import { verificationUrl } from '../../config/certificate';
import { downloadCertificatePdf, downloadCertificatePng, qrForUrl } from '../../utils/certificateExport';

const CertificateNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [created, setCreated] = useState<Certificate | null>(null);
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const templateRef = useRef<CertificateTemplateHandle>(null);

  const handleSubmit = async (values: CertificateFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const doc: Certificate = data.data;
        setCreated(doc);
        try {
          setQr(await qrForUrl(verificationUrl(doc.verificationSlug, doc.certificateId)));
        } catch {
          setQr('');
        }
      } else {
        setServerError(data.message || 'Failed to create certificate.');
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyUrl = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(verificationUrl(created.verificationSlug, created.certificateId));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const runExport = async (kind: string, fn: (n: HTMLElement) => Promise<void>) => {
    const n = templateRef.current?.node;
    if (!n || !created) return;
    try {
      setExporting(kind);
      await fn(n);
    } finally {
      setExporting(null);
    }
  };

  const fileBase = created ? `${created.verificationSlug}-${created.certificateId}` : 'certificate';

  if (created) {
    const url = verificationUrl(created.verificationSlug, created.certificateId);
    return (
      <div>
        <PageHeader title="Certificate Generated Successfully" subtitle={`Certificate ID: ${created.certificateId}`} />
        <ContentCard className="overflow-hidden">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-3 flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Certificate saved to the database.</span>
            </div>
            <CertificateTemplate
              ref={templateRef}
              data={{
                certificateId: created.certificateId,
                firstName: created.firstName,
                lastName: created.lastName,
                college: created.college,
                course: created.internshipTrainingCourse,
                durationText: created.durationText,
                startDate: created.startDate,
                endDate: created.endDate,
                hrHeadName: created.hrHeadName,
                hrHeadDesignation: created.hrHeadDesignation,
                hrHeadSignature: created.hrHeadSignature,
                managerName: created.managerName,
                managerDesignation: created.managerDesignation,
                managerSignature: created.managerSignature,
                verificationUrl: url,
                qrDataUrl: qr || undefined
              }}
            />
          </div>
          <div className="space-y-3 p-4 sm:p-6">
            <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 dark:bg-gray-800 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Verification URL</p>
                <p className="break-all font-mono text-sm text-primary-600 dark:text-primary-400">{url}</p>
              </div>
              <SecondaryButton onClick={copyUrl}>
                <Link2 className="h-4 w-4" /> {copied ? 'Copied!' : 'Copy URL'}
              </SecondaryButton>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/admin/certificates/${created.certificateId}`}
                className="inline-flex min-h-[40px] items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Open Verification Page
              </Link>
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200">
                Open Public Page
              </a>
              <SecondaryButton onClick={() => runExport('pdf', (n) => downloadCertificatePdf(n, fileBase))} disabled={exporting !== null}>
                <FileDown className="h-4 w-4" /> {exporting === 'pdf' ? 'Exporting…' : 'Download PDF'}
              </SecondaryButton>
              <SecondaryButton onClick={() => runExport('png', (n) => downloadCertificatePng(n, fileBase))} disabled={exporting !== null}>
                <ImageIcon className="h-4 w-4" /> {exporting === 'png' ? 'Exporting…' : 'Download PNG'}
              </SecondaryButton>
              <SecondaryButton onClick={() => navigate('/admin/certificates')}>
                <span className="inline-flex items-center gap-1.5"><ArrowLeft className="h-4 w-4" /> Back to list</span>
              </SecondaryButton>
            </div>
          </div>
        </ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Generate Certificate" subtitle="Enter candidate and internship details" />
      <CertificateForm
        initial={emptyCertificateForm()}
        submitting={submitting}
        submitLabel="Generate Certificate"
        serverError={serverError}
        previewIdLabel="SSXXXXXX"
        onCancel={() => navigate('/admin/certificates')}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CertificateNewPage;
