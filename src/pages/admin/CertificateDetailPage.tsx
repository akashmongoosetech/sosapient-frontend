import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft, Link2, Ban, CheckCircle, FileDown, Image as ImageIcon } from 'lucide-react';
import QRCode from 'qrcode';
import { authFetch } from '../../utils/api';
import {
  ContentCard, PageHeader, SecondaryButton, DangerButton,
  StatusBadge, LoadingState, ErrorState, ConfirmDialog
} from '../../components/admin/ui';
import CertificateTemplate from '../../components/certificates/CertificateTemplate';
import { Certificate, fullName, formatCertDate } from '../../types/certificate';
import { verificationUrl } from '../../config/certificate';
import { downloadCertificatePdf, downloadCertificatePng, downloadCertificateJpeg } from '../../utils/certificateExport';

const CertificateDetailPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState('');
  const templateRef = useRef<{ node: HTMLDivElement | null }>(null);

  const fetchDoc = useCallback(async () => {
    if (!certificateId) return;
    try {
      setLoading(true);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/certificates/${encodeURIComponent(certificateId)}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        setDoc(data.data);
        setError(null);
      } else {
        throw new Error(data.message || 'Certificate not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  }, [certificateId]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  useEffect(() => {
    if (!doc) return;
    QRCode.toDataURL(verificationUrl(doc.verificationSlug, doc.certificateId), { width: 220, margin: 1 })
      .then(setQr)
      .catch(() => setQr(''));
  }, [doc]);

  const copyUrl = async () => {
    if (!doc) return;
    try {
      await navigator.clipboard.writeText(verificationUrl(doc.verificationSlug, doc.certificateId));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const node = () => templateRef.current?.node || null;

  const runExport = async (kind: string, fn: (n: HTMLElement) => Promise<void>) => {
    const n = node();
    if (!n || !doc) return;
    try {
      setExporting(kind);
      await fn(n);
    } finally {
      setExporting(null);
    }
  };

  const fileBase = doc ? `${doc.verificationSlug}-${doc.certificateId}` : 'certificate';

  const confirmDelete = async () => {
    if (!doc) return;
    try {
      setDeleting(true);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/certificates/${doc.certificateId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Delete failed');
      navigate('/admin/certificates', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete certificate');
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async () => {
    if (!doc) return;
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/certificates/${doc.certificateId}/revoke`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: doc.status === 'valid' ? 'revoked' : 'valid' })
      });
      const data = await res.json();
      if (data.success && data.data) setDoc(data.data);
    } catch {
      // silent; badge keeps old state
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Certificate details" subtitle="View certificate" />
        <ContentCard><LoadingState message="Loading certificate…" /></ContentCard>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div>
        <PageHeader title="Certificate details" subtitle="View certificate" />
        <ContentCard>
          <ErrorState title="Unable to load certificate" body={error || 'Certificate not found.'} onRetry={fetchDoc} />
          <div className="flex justify-center pb-6">
            <Link to="/admin/certificates" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to list
            </Link>
          </div>
        </ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Certificate ${doc.certificateId}`}
        subtitle={`${fullName(doc)} · ${doc.course}`}
        actions={
          <>
            <SecondaryButton onClick={toggleStatus}>
              {doc.status === 'valid' ? (
                <span className="inline-flex items-center gap-1.5"><Ban className="h-4 w-4" /> Revoke</span>
              ) : (
                <span className="inline-flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Restore</span>
              )}
            </SecondaryButton>
            <Link
              to={`/admin/certificates/${doc.certificateId}/edit`}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <Pencil className="h-4 w-4" /> Edit
            </Link>
            <DangerButton onClick={() => setConfirming(true)}>
              <Trash2 className="h-4 w-4" /> Delete
            </DangerButton>
          </>
        }
      />

      <ContentCard className="overflow-hidden">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <CertificateTemplate
            ref={templateRef}
            data={{
              certificateId: doc.certificateId,
              firstName: doc.firstName,
              lastName: doc.lastName,
              college: doc.college,
              course: doc.internshipTrainingCourse,
              durationText: doc.durationText,
              startDate: doc.startDate,
              endDate: doc.endDate,
              hrHeadName: doc.hrHeadName,
              hrHeadDesignation: doc.hrHeadDesignation,
              hrHeadSignature: doc.hrHeadSignature,
              managerName: doc.managerName,
              managerDesignation: doc.managerDesignation,
              managerSignature: doc.managerSignature,
              verificationUrl: verificationUrl(doc.verificationSlug, doc.certificateId),
              qrDataUrl: qr || undefined
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6">
          <dl className="space-y-2 text-sm">
            {[['Certificate ID', doc.certificateId], ['Candidate', fullName(doc)], ['College', doc.college || '—'], ['Email', doc.email || '—'], ['Mobile', doc.mobileNumber || '—'], ['Course', doc.course || '—'], ['Training Course', doc.internshipTrainingCourse]].map(([k, val]) => (
              <div key={k} className="flex gap-2">
                <dt className="w-32 shrink-0 font-medium text-gray-500 dark:text-gray-400">{k}</dt>
                <dd className="text-gray-900 dark:text-white">{val}</dd>
              </div>
            ))}
          </dl>
          <dl className="space-y-2 text-sm">
            {[['Start date', formatCertDate(doc.startDate)], ['End date', formatCertDate(doc.endDate)], ['Duration', doc.durationText], ['HR Head', `${doc.hrHeadName} (${doc.hrHeadDesignation})`], ['Manager', `${doc.managerName} (${doc.managerDesignation})`], ['Created', doc.createdAt ? new Date(doc.createdAt).toLocaleString() : '—']].map(([k, val]) => (
              <div key={k} className="flex gap-2">
                <dt className="w-32 shrink-0 font-medium text-gray-500 dark:text-gray-400">{k}</dt>
                <dd className="text-gray-900 dark:text-white">{val}</dd>
              </div>
            ))}
            <div className="flex gap-2">
              <dt className="w-32 shrink-0 font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd><StatusBadge label={doc.status === 'valid' ? 'Valid' : 'Revoked'} tone={doc.status === 'valid' ? 'green' : 'red'} /></dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-32 shrink-0 font-medium text-gray-500 dark:text-gray-400">Verify URL</dt>
              <dd className="break-all font-mono text-xs text-primary-600 dark:text-primary-400">
                {verificationUrl(doc.verificationSlug, doc.certificateId)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-gray-200 p-4 dark:border-gray-700">
          <SecondaryButton onClick={copyUrl}>
            <Link2 className="h-4 w-4" /> {copied ? 'Copied!' : 'Copy URL'}
          </SecondaryButton>
          <SecondaryButton onClick={() => runExport('pdf', (n) => downloadCertificatePdf(n, fileBase))} disabled={exporting !== null}>
            <FileDown className="h-4 w-4" /> {exporting === 'pdf' ? 'Exporting…' : 'Download PDF'}
          </SecondaryButton>
          <SecondaryButton onClick={() => runExport('png', (n) => downloadCertificatePng(n, fileBase))} disabled={exporting !== null}>
            <ImageIcon className="h-4 w-4" /> {exporting === 'png' ? 'Exporting…' : 'Download PNG'}
          </SecondaryButton>
          <SecondaryButton onClick={() => runExport('jpeg', (n) => downloadCertificateJpeg(n, fileBase, 'jpeg'))} disabled={exporting !== null}>
            <ImageIcon className="h-4 w-4" /> {exporting === 'jpeg' ? 'Exporting…' : 'Download JPEG'}
          </SecondaryButton>
          <SecondaryButton onClick={() => runExport('jpg', (n) => downloadCertificateJpeg(n, fileBase, 'jpg'))} disabled={exporting !== null}>
            <ImageIcon className="h-4 w-4" /> {exporting === 'jpg' ? 'Exporting…' : 'Download JPG'}
          </SecondaryButton>
        </div>
      </ContentCard>

      <ConfirmDialog
        open={confirming}
        title="Delete certificate?"
        body={`Are you sure you want to permanently delete certificate ${doc.certificateId}?`}
        busy={deleting}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CertificateDetailPage;
