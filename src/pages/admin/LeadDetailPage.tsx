import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pencil, Trash2, Phone, Globe, MessageCircle, Copy, Check } from 'lucide-react';
import { authFetch } from '../../utils/api';
import {
  LEAD_STATUSES,
  leadStatusTone,
  leadDigits,
  formatLeadDate,
  type Lead,
  type LeadStatus,
} from '../../types/lead';
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  AdminSelect,
  StatusBadge,
  ContentCard,
  LoadingState,
  ErrorState,
  ConfirmDialog,
} from '../../components/admin/ui';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3">
      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-gray-900 dark:text-white">{children}</dd>
    </div>
  );
}

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<'phone' | 'web' | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/${encodeURIComponent(id || '')}`);
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          setDoc(data.data);
        } else {
          setLoadError(data.message || 'Lead not found.');
        }
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load lead.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const changeStatus = async (next: LeadStatus) => {
    if (!doc || next === doc.status || statusBusy) return;
    setStatusBusy(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/${doc._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (data.success && data.data) setDoc(data.data);
    } finally {
      setStatusBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!doc) return;
    setDeleting(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/${doc._id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) {
        navigate('/admin/leads', { replace: true });
      }
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  const copyPhone = async () => {
    if (!doc) return;
    try {
      await navigator.clipboard.writeText(doc.phoneUnformatted || doc.phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const copyText = async (text: string, field: 'phone' | 'web') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField((prev) => (prev === field ? null : prev));
      }, 1500);
    } catch {
      // clipboard unavailable
    }
  };

  if (loading) return <LoadingState message="Loading lead…" />;
  if (loadError || !doc) {
    return (
      <div>
        <PageHeader title="Lead Details" subtitle="Could not load this lead" />
        <ErrorState title="Could not load lead" body={loadError || 'Lead not found.'} onRetry={() => navigate('/admin/leads')} />
      </div>
    );
  }

  const digits = leadDigits(doc);
  const waUrl = digits ? `https://wa.me/${digits}` : null;

  return (
    <div>
      <PageHeader
        title={doc.title || '(No title)'}
        subtitle={`Lead details · ${doc.status}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminSelect
              aria-label="Change lead status"
              value={doc.status}
              disabled={statusBusy}
              onChange={(e) => changeStatus(e.target.value as LeadStatus)}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </AdminSelect>
            <Link to={`/admin/leads/${doc._id}/edit`}>
              <PrimaryButton type="button">
                <Pencil className="mr-1.5 h-4 w-4" /> Edit
              </PrimaryButton>
            </Link>
            <DangerButton type="button" onClick={() => setConfirming(true)}>
              <Trash2 className="mr-1.5 h-4 w-4" /> Delete
            </DangerButton>
          </div>
        }
      />

      <ContentCard>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusBadge label={doc.status} tone={leadStatusTone(doc.status)} />
          {doc.categoryName && <span className="text-sm text-gray-500 dark:text-gray-400">{doc.categoryName}</span>}
        </div>
        <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <Row label="Business / Lead Title">{doc.title || '—'}</Row>
          <Row label="Category">{doc.categoryName || '—'}</Row>
          <Row label="City">{doc.city || '—'}</Row>
          <Row label="Address">{doc.address || '—'}</Row>
          <Row label="Phone">
            {doc.phoneUnformatted || doc.phone ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                <a href={`tel:${(doc.phoneUnformatted || doc.phone).replace(/\s/g, '')}`} className="text-primary-600 dark:text-primary-400">
                  {doc.phoneUnformatted || doc.phone}
                </a>
                <button
                  type="button"
                  onClick={copyPhone}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                )}
              </span>
            ) : (
              '—'
            )}
          </Row>
          <Row label="Phone (unformatted)">{doc.phoneUnformatted || '—'}</Row>
          <Row label="Website">
            {doc.website ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                <a href={doc.website} target="_blank" rel="noopener noreferrer" className="break-all text-primary-600 dark:text-primary-400">
                  {doc.website}
                </a>
                <button
                  type="button"
                  onClick={() => copyText(doc.website, 'web')}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                >
                  {copiedField === 'web' ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedField === 'web' ? 'Copied' : 'Copy'}
                </button>
              </span>
            ) : (
              '—'
            )}
          </Row>
          <Row label="Status">
            <StatusBadge label={doc.status} tone={leadStatusTone(doc.status)} />
          </Row>
          <Row label="Created">{formatLeadDate(doc.createdAt)}</Row>
          <Row label="Last Updated">{formatLeadDate(doc.updatedAt)}</Row>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          {(doc.phoneUnformatted || doc.phone) && (
            <a href={`tel:${(doc.phoneUnformatted || doc.phone).replace(/\s/g, '')}`}>
              <SecondaryButton type="button">
                <Phone className="mr-1.5 h-4 w-4" /> Call Now
              </SecondaryButton>
            </a>
          )}
          {doc.website && (
            <a href={doc.website} target="_blank" rel="noopener noreferrer">
              <SecondaryButton type="button">
                <Globe className="mr-1.5 h-4 w-4" /> Open Website
              </SecondaryButton>
            </a>
          )}
          <Link to="/admin/leads">
            <SecondaryButton type="button">Back to Leads</SecondaryButton>
          </Link>
        </div>
      </ContentCard>

      <ConfirmDialog
        open={confirming}
        title="Delete lead?"
        body={`Delete "${doc.title || 'this lead'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        busy={deleting}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default LeadDetailPage;
